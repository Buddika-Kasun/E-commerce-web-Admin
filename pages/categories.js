import Layout from "@/components/Layout";
import axios from "axios";
import { types } from "mime-types";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {

    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    },[]);

    function fetchCategories() {
       axios.get('/api/categories').then(result => {
            setCategories(result.data);
        }) 
    }
    
    async function saveCategory(ev) {
        ev.preventDefault();

        const data = {name};
        data.parentCategory = parentCategory? parentCategory : null;

        if (editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }
        else{
            await axios.post('/api/categories', data);
        }
        
        setName('');
        setParentCategory('');

        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id || '');
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure ?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancleButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!', 
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed){
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        });
    }

    return(
        <Layout>
            <h1 >Categories</h1>
            <label>{editedCategory ? <div>Edit category <span className="text-red-500 text-xl">{editedCategory.name}</span></div> : 'Create new category'}</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input type="text" placeholder="Category name" value={name} onChange={ev => setName(ev.target.value)} className="h-8"></input>
                <select value={parentCategory} onChange={ev => setParentCategory(ev.target.value)}>
                    <option value="" className="mb-0">No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option key={categories._id} value={category._id}>{category.name}</option>
                    ))}
                </select> 
                <button type="submit" className="bg-primary text-white px-4 h-8 rounded-md">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Categories name</td>
                        <td>Parent category</td>
                        <td></td> 
                    </tr>
                </thead>   
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td className="bg-red">
                                <button onClick={() => editCategory(category)} className="btn-default">Edit</button>
                                <button onClick={() => deleteCategory(category)} className="btn-red">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>            
            </table>
        </Layout>
    )
}

export default withSwal(({swal, ref}) => (
    <Categories swal={swal} />
));