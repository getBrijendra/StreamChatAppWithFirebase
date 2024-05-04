import { useMutation } from "@tanstack/react-query"
import {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query/build/lib/types"
import axios, { AxiosResponse } from "axios"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"
import { StreamChat } from "stream-chat"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential  } from "firebase/auth";
import { auth } from "../../firebaseConfig";

type AuthContext = {
  user?: User
  streamChat?: StreamChat
  signup: UseMutationResult<AxiosResponse, unknown, User>
  login: UseMutationResult<{ token: string; user: User }, unknown, User>
  logout: UseMutationResult<AxiosResponse, unknown, void>
}

type User = {
  id: string
  name: string
  password: string
  image?: string
}

const Context = createContext<AuthContext | null>(null)

export function useAuth() {
  return useContext(Context) as AuthContext
}

export function useLoggedInAuth() {
  return useContext(Context) as AuthContext &
    Required<Pick<AuthContext, "user">>
}

type AuthProviderProps = {
  children: ReactNode
}

function keepAlphaNumeric(str: string): string {
  // Use a regular expression to match alphanumeric characters and spaces
  const alphanumericRegex = /[^a-z0-9]/g;
  // Remove non-alphanumeric characters, preserving spaces
  const filteredStr = str.replace(alphanumericRegex, '');
  // Return the filtered string
  return filteredStr;
}

/*
  NOTE: authenticating using firebase auth and stream also.
  

*/


export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const [user, setUser] = useLocalStorage<User>("user")
  const [token, setToken] = useLocalStorage<string>("token")
  const [fbtoken, setFBToken] = useLocalStorage<string>("fbtoken")
  const [streamChat, setStreamChat] = useState<StreamChat>()

  const signup = useMutation({
    mutationFn: async (user: User) => {
      // const res =  await axios.post(`${import.meta.env.VITE_REGISTER_FUNCTION_URL}`, user)
      // if (res.status == 200) {
      //   console.log('signup success in stream', res?.data)
      // } else {
      //   console.log('signup failure in stream', res?.data)
      // }
      // return res
      try {
        const res = await createUserWithEmailAndPassword(auth, user.id, user.password);
        console.log(res)
      } catch {
          console.log("Sorry, something went wrong. Please try again.");
          return Promise.reject()
      }
      let user1 = user 
      user1.id = keepAlphaNumeric(user1.id)
      const p =  axios.post(`${import.meta.env.VITE_REGISTER_FUNCTION_URL}`, user1)
      return p
      //return axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, user)
    },
    onSuccess() {
      // try {
      //   createUserWithEmailAndPassword(auth, user.id, user.password);
      //   navigate("/login")
      // } catch {
      //     console.log("You entered a wrong username or password.");
      // }
      navigate("/login")
    },
  })

  const login = useMutation({
    mutationFn: async (user1: User) => {
      //user1.id = keepAlphaNumeric(user1.id)
      let firebaseToken: string = ''
      try {
        const resFB: any = await signInWithEmailAndPassword(auth, user1.id, user1.password);
        console.log(resFB)
        firebaseToken = resFB?.user?.accessToken
        setFBToken(firebaseToken)
        //navigate("./profile");
      } catch {
          console.log("You entered a wrong username or password.");
          return Promise.reject()
      }

      user1.id = keepAlphaNumeric(user1.id)
      const res = await  axios.post(`${import.meta.env.VITE_LOGIN_FUNCTION_URL}`,{ id: user1.id}, { headers: {"Authorization" : `Bearer ${firebaseToken}`}})
      console.log(res.data)
        //.post(`${import.meta.env.VITE_SERVER_URL}/login`, { id })
        // .then(res => {
        //   return res.data as { token: string; user: User }
        // })
      return res.data as { token: string; user: User }
    },
    onSuccess(data) {
      setUser(data.user)
      setToken(data.token)
    },
    onError() {
      console.log('onError in login')
    }
  })

  const logout = useMutation({
    mutationFn: () => {
      //return axios.post(process.env.LOGOUT_FUNCTION_URL, { token })
      return axios.post(`${import.meta.env.VITE_LOGOUT_FUNCTION_URL}`, { token })
      //return axios.post(`${import.meta.env.VITE_SERVER_URL}/logout`, { token })
    },
    onSuccess() {
      setUser(undefined)
      setToken(undefined)
      setStreamChat(undefined)
    },
  })

  useEffect(() => {
    if (token == null || user == null) return
    const chat = new StreamChat(import.meta.env.VITE_STREAM_API_KEY!)

    if (chat.tokenManager.token === token && chat.userID === user.id) return

    let isInterrupted = false
    const connectPromise = chat.connectUser(user, token).then(() => {
      if (isInterrupted) return
      setStreamChat(chat)
    })

    return () => {
      isInterrupted = true
      setStreamChat(undefined)

      connectPromise.then(() => {
        chat.disconnectUser()
      })
    }
  }, [token, user])

  return (
    <Context.Provider value={{ signup, login, user, streamChat, logout }}>
      {children}
    </Context.Provider>
  )
}
