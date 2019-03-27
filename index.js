const http = require('http')
const fs = require('fs')

const html = fs.readFileSync('public/index.html')
const fileUrl = 'scorelist.tsv'
const t = '\t'

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let bodyText = ''
        req.on('data', chunk => {
            bodyText += chunk.toString()
        }).on('end', () => {
            let tsvData = (() => {
                const data = {}
                bodyText.split('&').forEach(each => {
                    const [k, v] = each.split('=')
                    data[k] = decodeURIComponent(v).replace(/\t/g, ' ')
                })
                return '' +
                    (data.title || 'no-title') + t +
                    (data.initial || '-') + t +
                    (data.hint1 || '') + t + (data.hint2 || '') + t + (data.hint3 || '') + t + (data.hint4 || '') + t + (data.hint5 || '') +
                    '\r\n'
            })()
            fs.appendFileSync(fileUrl, tsvData)
        })
        res.end()
        return
    }
    res.end(html)
})

server.listen(8080, () => console.log('Server is listening.'))