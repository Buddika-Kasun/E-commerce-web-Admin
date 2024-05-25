import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Settings({swal}) {

    const [featureProduct, setFeatureProduct] = useState('');
    const [currentFeatureProduct, setCurrentFeatureProduct] = useState('');
    const [products, setProducts] = useState([]);

    function fetchFeatureProduct(){
        axios.get('/api/settings').then(result => {
            const id = result.data.id;

            axios.get('/api/products?id='+id).then(result => {
                setCurrentFeatureProduct(result.data);
            })
        });
    }

    useEffect(() => {

        axios.get('/api/products').then(result => {
            setProducts(result.data);
        });

        fetchFeatureProduct();

    },[]);
    async function saveFeatureProduct(ev) {
        ev.preventDefault();

        const data = featureProduct? {id: featureProduct} : {id: products[0]._id};
        await axios.post('/api/settings', data);

        swal.fire({
            title: "Success",
            confirmButtonText: 'Ok', 
            confirmButtonColor: '#5542F6',
            reverseButtons: true,
        });
        
        fetchFeatureProduct();
        setFeatureProduct('');
    }

    return (
        <Layout>
            <h1>Settings</h1>
            <form onSubmit={saveFeatureProduct} className="flex flex-wrap gap-2">
                <label>Select feature product</label>
                <select value={featureProduct} onChange={ev => setFeatureProduct(ev.target.value)}>
                    {products.length > 0 && products.map(product => (
                        <option key={product._id} value={product._id}>{product.title}</option>
                    ))}
                </select> 
                <button type="submit" className="bg-primary text-white px-4 h-8 rounded-md">Save settings</button>
            </form>
            <table className="basic mt-10">
                <thead>
                    <tr>
                        <td>Current feature product</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {currentFeatureProduct && 
                        <tr key={currentFeatureProduct._id}>
                            <td>{currentFeatureProduct.title}</td>
                            <td><img src={currentFeatureProduct.images[0]} alt={currentFeatureProduct.title} className="h-60 w-60"/></td>
                        </tr>
                    } 
                </tbody>
            </table>
        </Layout>
    )
}

export default withSwal(({swal, ref}) => (
    <Settings swal={swal} />
));