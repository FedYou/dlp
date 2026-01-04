function serializeName(name: string) {
  return name.replace(/\//g, '-').replace(/\n/g, ' ')
}

export default serializeName
