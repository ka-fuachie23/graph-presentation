window.Graph = class Graph {
  constructor(entries) {
    this.adjacencyList = new Map(entries)
  }

  addNode(node) {
    this.adjacencyList.set(node, [])
  }

  addEdge(source, destination) {
    this.adjacencyList.get(source).push(destination)
    this.adjacencyList.get(destination).push(source)
  }
}