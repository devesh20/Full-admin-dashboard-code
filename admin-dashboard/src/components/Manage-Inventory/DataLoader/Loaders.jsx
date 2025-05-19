import axios from 'axios'

export async function loadMaterialReceivedPurchasedData() {
    const {data} = await axios.get("/api/material-recieved/get-all")
      return data.data
}

export async function loadMaterialIssuedData() {
    const {data} = await axios.get("/api/material-issued-purchased/get-all")
      return data.data
}

export async function loadMaterialIssuedSuppliedData() {
    const {data} = await axios.get("/api/material-issued-supplied/get-all")
      return data.data
}

export async function loadTotalInventoryData() {
    const {data} = await axios.get("/api/inventory/get-all")
      return data.data
}

export async function loadSuppliedPendingInventoryData() {
    const {data} = await axios.get("/api/pendingInventorySupplied/get-all")
      return data.data
}

export async function loadMaterialSuppliedData() {
    const {data} = await axios.get("/api/material-supplied/get-all")
      return data.data
}

export async function loadPurchasedPendingInventoryData() {
  const {data} = await axios.get("/api/pendingInventory/get-all")
    return data.data
}