import NextLink from 'next/link';
import { CategoryOutlined, ConfirmationNumberOutlined } from '@mui/icons-material';
import { Box, Chip, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Image from 'next/image';
import useSWR from 'swr';


import { AdminLayout } from '../../components/layouts/AdminLayout';
import { IProduct } from '../../interfaces';

const columns: GridColDef[] = [
    {
        field: 'img', 
        headerName: 'Photo',
        sortable: false,
        renderCell: ({ row }: GridValueGetterParams ) => {
            return (
                <a href={ `/product/${ row.slug }`} target="_blank" rel="noreferrer">
                    <Image 
                        src={`/products/${row.img}`}
                        width={ 50 }
                        height={ 50 }
                        alt={ row.title }
                    />
                </a>
            )
        }
    },
    // { field: 'title', headerName: 'Title', width: 250 },
    { 
        field: 'title', 
        headerName: 'Title', 
        width: 250,
        renderCell: ({ row }: GridValueGetterParams ) => {
            return (
                <NextLink href={`/admin/products/${ row.slug }`} passHref>
                    <Link underline='always'>
                        { row.title }
                    </Link>
                </NextLink>
            )
        }
    },
    { field: 'gender', headerName: 'Género' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'inStock', headerName: 'Inventario' },
    { field: 'price', headerName: 'Precio' },
    { field: 'sizes', headerName: 'Tallas', width: 250 },
    
];

const OrdersPage = () => {

    const { data, error } = useSWR<IProduct[]>('/api/admin/products');
    
    if ( !data && !error ) return (<></>);
    
    
    const rows = data!.map( product => ({
        img: product.images[0],
        id: product._id,
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug,
    }));


    return (
        <AdminLayout
            title={`Productos (${ data?.length })`}
            subtitle='Mantenimiento de productos'
            icon={ <CategoryOutlined /> }
        >

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                    <DataGrid
                        rows={ rows }
                        columns={ columns }
                        pageSize={ 10 }
                        rowsPerPageOptions={ [10] }
                    />

                </Grid>
            </Grid>

        </AdminLayout>
  )
}

export default OrdersPage