import { DotLoader, HashLoader } from "react-spinners";

export default function Spinner({color,size,type}){
    return(
        <>
            {type === "dot" && <DotLoader color={color} speedMultiplier={1.5} size={size} />}
            {type === "hash" && <HashLoader color={color} size={size} speedMultiplier={1.5}/>}
        </>
    );
}
