"use client"
import Drapht from "@/app/Drapht"
import { Provider } from "react-redux";
import store from "./redux/store";
export default function Home() {
  return (
    <Provider store={store}>
    <Drapht/>
    </Provider>
  );
}
