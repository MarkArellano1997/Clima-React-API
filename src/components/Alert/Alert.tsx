import { ReactNode } from "react"
import style from "../Alert/Alert.module.css"

export default function Alert({children}: {children: ReactNode}) {
  return (
    <div className={style.alert}>
      {children}
    </div>
  )
}
