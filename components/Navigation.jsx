import { Link, useLocation, useNavigate } from "react-router";
import { menuItems } from "@/src/utils/constant.js";
import { useState } from "react";

const Navigation = () => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  console.log({ pathname });
  const handleClick = (index, path) => {
    setCurrentIndex(index);
    navigate(path);
  };

  return (
    <ul className={"p-3 font-bold"}>
      {menuItems.map(({ title, path }, index) => (
        <li
          key={title}
          className={` my-2 p-3 rounded-md cursor-pointer hover:bg-primary hover:text-white ${currentIndex === index || pathname === path ? "bg-primary text-white" : ""}`}
          onClick={() => handleClick(index, path)}
        >
          <Link to={path}>{title}</Link>
        </li>
      ))}
    </ul>
  );
};
export default Navigation;
