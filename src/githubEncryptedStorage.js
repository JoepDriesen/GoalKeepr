import CryptoJS from "crypto-js"

export default (githubUsername, githubPassword, repositoryName) => (appName, encryptionPassphrase) => {
  encryptionPassphrase = encryptionPassphrase == null ? "" : encryptionPassphrase
  
  const ghUrl = `https://api.github.com/repos/${githubUsername}/${repositoryName}`
  const authString = "Basic " + btoa(`${githubUsername}:${githubPassword}`)
    
  const decrypt = (cypher_text) => {
    var stringified = cypher_text
    var decrypted;

    var key128Bits = CryptoJS.PBKDF2(encryptionPassphrase, CryptoJS.enc.Hex.parse(appName), { keySize: 128/32 })

    decrypted = CryptoJS.AES.decrypt(cypher_text, key128Bits, { iv: CryptoJS.enc.Hex.parse(appName) });

    stringified = decrypted.toString(CryptoJS.enc.Utf8);

    try {
      return JSON.parse(stringified)
    } catch (err) {
      if (!err instanceof SyntaxError) {
        throw err
      }
    }
    return stringified
  }

  const encrypt = (to_encrypt) => {
    const stringified = (typeof to_encrypt === "string" || to_encrypt instanceof String) ? to_encrypt : JSON.stringify(to_encrypt)
    
    var key128Bits = CryptoJS.PBKDF2(encryptionPassphrase, CryptoJS.enc.Hex.parse(appName), { keySize: 128/32 });
    var encrypted = CryptoJS.AES.encrypt(stringified, key128Bits, { iv: CryptoJS.enc.Hex.parse(appName) });
    
    return encrypted.toString()

  }
  
  const getQS = (queryData) => "?" + Object.keys(queryData).map(k => `${k}=${queryData[k]}`).join("&")
  const ghFetch = (url, opts) => {
    if (!opts) {
      opts = {}
    }
    if (opts.qs) {
      url += getQS(opts.qs)
    }
    const addHeaders = {
      "Authorization": authString,
      /*"Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": 0,*/
    }
    if (opts.headers) {
      opts.headers = Object.assign({}, opts.headers, addHeaders)
    } else {
      opts.headers = addHeaders
    }
    
    opts = Object.assign({}, opts, {
      contentType: "application/json",
      cache: "no-cache",
    })
    return fetch(url, opts)
  }
  
  const milestone = (async () => {
    try {
      const response = await ghFetch(`${ghUrl}/milestones`)
      const result = await response.json()
      let search = result.filter(m => decrypt(m.title, false) === (appName === "default" ? "Default" : appName))

      if (search.length <= 0) {
        const newMilestone = await ghFetch(`${ghUrl}/milestones`, {
          method: "POST",
          body: JSON.stringify({
            title: encrypt(appName),
          })
        })
        return (await newMilestone.json())
      }
      return search[0]
    } catch (err) {
      throw new Error("Database Connection Error: Invalid Credentials?")
    }
  })()
  
  const getIssuesPage = async (labels, page, perPage) => {
    const response = await ghFetch(`${ghUrl}/issues`, {
      qs: {
        milestone: (await milestone).number,
        per_page: perPage,
        page: page,
        ...(labels ? { labels: labels.join(",") } : {})
      },
    })
          
    if (response.status < 200 || response.status >= 300) {
      throw new Error(await response.json().message)
    }

    return (await response.json()).map(r => ({
      ...r,
      body: {
        ...decrypt(r.body),
        ...(decrypt(r.body).id ? { id: decrypt(r.body).id } : { id: r.number }),
      },
      labels: r.labels.map(l => ({
        ...l,
        name: decrypt(l.name).label ? decrypt(l.name).label : decrypt(l.name),
      })),
      milestone: {
        ...r.milestone,
        title: decrypt(r.milestone.title, false),
      },
    }))
  }
  
  const getIssues = async (labels) => {
    let page = 1
    let pageResults = null
    const perPage = 100
    const results = []

    while (pageResults === null || pageResults.length >= perPage) {
      pageResults = await getIssuesPage(labels, page, perPage)

      results.push(...pageResults)

      page++
    }

    return results
  }
  
  return {
    dump: getIssues,
    
    load: async (jsonDump) => {
      await Promise.all(jsonDump.map((doc, index) => new Promise((resolve, reject) => {
        setTimeout(async () => {
          const response = await ghFetch(`${ghUrl}/issues`, {
            method: "POST",
            body: JSON.stringify({
              title: encrypt(Math.floor((Math.random() * 100) + 1)),
              body: encrypt(doc.body),
              labels: doc.labels.map(l => encrypt(l.name)),
              milestone: (await milestone).number,
            })
          })
          if (response.status < 200 || response.status >= 300) {
            return reject((await response.json().message))
          }
          return resolve(await response.json())
        }, 3000 * index)
      })))
    },
    
    getCollection: (collectionName) => {
      const label = encrypt(collectionName)
      
      return {
        read: async () => {
          return (await getIssues([label])).map(i => ({
            ...i.body,
            __gehId: i.number,
          }))
        },
        update: async (doc) => {
          if (doc.__gehId === undefined) {
            throw new Error("Not a GEH document (__gehID is missing)!")
          }
          const id = doc.__gehId
          delete doc.__gehId
          
          const response = await ghFetch(`${ghUrl}/issues/${ id }`, {
            method: "PATCH",
            body: JSON.stringify({
              body: encrypt(doc),
              state: "open",
            })
          })
          
          if (response.status < 200 || response.status >= 300) {
            throw new Error(await response.json().message)
          }
          
          return
        }
      }
    }
    
  }
}