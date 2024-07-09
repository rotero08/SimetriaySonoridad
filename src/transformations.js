// transformations.js
const notes = [
  { note: 'C', num: 0 },
  { note: 'C♯', num: 1 },
  { note: 'D', num: 2 },
  { note: 'E♭', num: 3 },
  { note: 'E', num: 4 },
  { note: 'F', num: 5 },
  { note: 'F♯', num: 6 },
  { note: 'G', num: 7 },
  { note: 'G♯', num: 8 },
  { note: 'A', num: 9 },
  { note: 'B♭', num: 10 },
  { note: 'B', num: 11 },
]

const noteToNum = (note) => notes.find((n) => n.note === note)?.num
const numToNote = (num) => notes.find((n) => n.num === num)?.note

const parseTransformation = (input) => {
  const regex = /^(T|I)(\d+)\((.*)\)$/

  const parseNested = (input) => {
    const match = input.match(regex)
    if (match) {
      const type = match[1]
      const value = parseInt(match[2], 10)
      const { transformations, vector } = parseNested(match[3])
      return { transformations: [...transformations, { type, value }], vector }
    } else {
      const vector = input
        .replace(/[[\]]/g, '')
        .split(',')
        .map((val) => val.trim())
        .map((val) => (isNaN(val) ? noteToNum(val) : parseInt(val, 10)))
      return { transformations: [], vector }
    }
  }

  return parseNested(input)
}

const applyTransformation = (vector, transformation) => {
  if (transformation.type === 'T') {
    return vector.map((note) => (note + transformation.value) % 12)
  } else if (transformation.type === 'I') {
    return vector.map((note) => (-note + transformation.value + 12) % 12)
  }
  return vector
}

const applyTransformations = (vector, transformations) => {
  return transformations.reduce((acc, transformation) => {
    return applyTransformation(acc, transformation)
  }, vector)
}

const validateVector = (vector) => {
  const uniqueValues = new Set(vector)
  return uniqueValues.size === vector.length && vector.every((val) => notes.some((n) => n.note === val || n.num === val))
}

const combineTransformations = (vector, transformations) => {
  const transformedVector = applyTransformations(vector, transformations)
  const combinedTransformation = transformations.filter((t) => t.type === 'T').reduce((acc, curr) => acc + curr.value, 0)
  const inversionTransformations = transformations.filter((t) => t.type === 'I')
  const combinedVector = inversionTransformations.length
    ? `${inversionTransformations.map((t) => `I${t.value}`).join('(')}(T${combinedTransformation}([${transformedVector.join(', ')}]))${')'.repeat(inversionTransformations.length)}`
    : `T${combinedTransformation}([${transformedVector.join(', ')}])`
  return combinedVector
}

export {
  parseTransformation,
  applyTransformation,
  applyTransformations,
  validateVector,
  combineTransformations,
  noteToNum,
  numToNote,
}
