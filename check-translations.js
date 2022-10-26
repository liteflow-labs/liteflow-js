const { readdirSync, readFileSync } = require('fs')
const { invariant } = require('ts-invariant')

function toFlatPropertyMap(obj, keySeparator = '.') {
  const flattenRecursive = (obj, parentProperty, propertyMap = {}) => {
    for (const [key, value] of Object.entries(obj)) {
      const property = parentProperty
        ? `${parentProperty}${keySeparator}${key}`
        : key
      if (value && typeof value === 'object') {
        flattenRecursive(value, property, propertyMap)
      } else {
        propertyMap[property] = value
      }
    }
    return propertyMap
  }
  return flattenRecursive(obj)
}

function testLocale(base, current, path) {
  const baseKeys = Object.keys(base)
  const currentKeys = Object.keys(current)

  baseKeys.forEach((x) =>
    invariant(
      currentKeys.includes(x),
      `Missing key: ${x}\nCurrent value: ${base[x]}\n${path}`,
    ),
  )
  currentKeys.forEach((x) =>
    invariant(baseKeys.includes(x), `Extra key: ${x}\n${path}`),
  )
}

async function main(path, file) {
  const translations = toFlatPropertyMap(
    JSON.parse(readFileSync(`${path}/locales/en/${file}`).toString()),
  )
  for (const dir of readdirSync(`${path}/locales`, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue
    if (dir.name === 'en') continue

    const otherTr = toFlatPropertyMap(
      JSON.parse(
        readFileSync(`${path}/locales/${dir.name}/${file}`).toString(),
      ),
    )

    testLocale(translations, otherTr, `${path}/locales/${dir.name}/${file}`)
  }
}

const dir = process.argv[2]
const file = process.argv[3]
console.log()
console.log(`Checking translations in ${dir} for ${file}`)
main(dir, file)
  .then(() => console.log('All good'))
  .catch((e) => {
    console.error(e)
    process.exit(-1)
  })
