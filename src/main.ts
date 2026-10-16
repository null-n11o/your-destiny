import { mount } from "./ui/app";
import "./style.css";

const root = document.querySelector("#app");
if (root instanceof HTMLElement) mount(root);
