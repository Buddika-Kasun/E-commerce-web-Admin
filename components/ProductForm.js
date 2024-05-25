import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: existingCategory,
}) {
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price,setPrice] = useState('');
    const [images,setImages] = useState(existingImages || []);
    const [button,setButton] = useState('Add');
    const [goToProducts,setGoToProducts] = useState(false);
    const [isUploading,setIsUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    },[]);

    useEffect(() => {
        setTitle(existingTitle);
        setDescription(existingDescription);
        setPrice(existingPrice);
        setImages(existingImages); 
        setCategory(existingCategory);
        (_id != undefined) ? setButton('Edit') :'';
    },[_id]);
    
    async function createProduct(ev) {
        ev.preventDefault();
        const data = {title,description,price,images,category};
        if (_id) {
            //update
            axios.put('/api/products', {...data,_id});
        }
        else{
            //create
            axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    useEffect(() => {
        if(goToProducts){
            router.push("/products");
        }
    }, [goToProducts]);

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if(files.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/upload', data);
            console.log(res.data);
            setImages(oldImages => {
                if(oldImages == undefined){
                    return [...res.data.links];
                }
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false);
        }
    }

    function removeImage(imageUrl) {
        setImages(images.filter(image => image !== imageUrl));
    }
    
    function updateImagesOrder(images) {
        setImages(images);
    }

    return(
        <form onSubmit={createProduct} >
            <label>Product name</label>
            <input type="text" placeholder="Product name" value={title} onChange={ev => setTitle(ev.target.value)}/>
            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value=''>Uncategorized</option>
                {categories.length > 0 && (categories.map(c => {
                    return <option key={c._id} value={c._id}>{c.name}</option>
                }))}
            </select>
            <label>Photos</label>
            <div className="mb-2 flex flex-wrap gap-2">
                <ReactSortable className="flex flex-wrap gap-2" list={images} setList={updateImagesOrder}>
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 relative ">
                            <img src={link} alt="" className="rounded-lg border border-gray-300 bg-white shadow-sm"/>
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-tr-lg rounded-bl-xl px-1 pb-0.5 "
                                onClick={() => removeImage(link)}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 w-24 flex items-center justify-center">
                        <Spinner type='dot' color='#5542F6' size='30px'/>
                    </div>
                )}
                <label className="w-24 h-24 border border-gray-300 flex items-center flex-col justify-center text-sm gap-1 text-gray-400 rounded-lg bg-white shadow-sm cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Add image
                    <input type="file" onChange={uploadImages} className="hidden "/>
                </label>
                {/* {!images?.length && (
                    <div>No photos in this product</div>
                )} */}
            </div>
            <label>Description</label>
            <textarea placeholder="Description" value={description} onChange={ev => setDescription(ev.target.value)}></textarea>
            <label>Price (in LKR)</label>
            <input type="number" placeholder="Price" value={price} onChange={ev => setPrice(ev.target.value)}/>
            <div className="flex gap-4 my-4">
               <button className="btn-primary" type="submit">{button}</button>
                <a className="text-white px-4 py-1 rounded-md shadow-sm bg-red-400" href={'/products'}>Cancle</a> 
            </div>
        </form>
    );
}