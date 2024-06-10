import { instance } from "./axios";

export async function getMediaPsiw(id: string){
  try {
    const response = await instance.get(`/psiw/${id}`)

    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function getMediaReact(id: string){
  try {
    const response = await instance.get(`/react/${id}`)

    return response.data
  } catch (e) {
    console.log(e)
  }
}

export async function sendForm(data: FormData){
  try {
    const response = await instance.post('/psiw', data)

    return response.data.id
  } catch (e) {
    console.log(e)
  }
}

export async function sendReact(data: FormData){
  try {
    const response = await instance.post('/react', data)

    return response.data.id
  } catch (e) {
    console.log(e)
  }
}