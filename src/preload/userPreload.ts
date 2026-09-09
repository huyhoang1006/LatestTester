import { ipcRenderer } from 'electron'

export const userPreload = () => ({
  login: (user: unknown) => ipcRenderer.invoke('login', user),
  signup: (user: unknown) => ipcRenderer.invoke('signup', user),
  changePass: (user: unknown) => ipcRenderer.invoke('changePass', user),
  getAllUser: () => ipcRenderer.invoke('getAllUser'),
  editUserInfo: (user: unknown) => ipcRenderer.invoke('editUserInfo', user),
  addUser: (user: unknown) => ipcRenderer.invoke('addUser', user),
  deleteUser: (id: string) => ipcRenderer.invoke('deleteUser', id)
})
