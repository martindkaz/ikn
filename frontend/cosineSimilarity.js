

function dotProduct(x, y) {
  let result = 0;
  for (let i = 0, l = Math.min(x.length, y.length); i < l; i += 1) {
    result += x[i] * y[i];
  }
  return result;
}

function normalize(x) {
  let result = 0;
  for (let i = 0, l = x.length; i < l; i += 1) {
    result += x[i]**2;
  }
  return Math.sqrt(result);
}

export default function cosineSimilarity(x, y) {
  return dotProduct(x, y) / (normalize(x) * normalize(y));
}

