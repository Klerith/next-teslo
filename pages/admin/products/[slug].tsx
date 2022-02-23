import React, { FC } from 'react'
import { GetServerSideProps } from 'next'
import { AdminLayout } from '../../../components/layouts'
import { IProduct } from '../../../interfaces';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useState } from 'react';


const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']


interface FormData {
    description: string;
    images     : string[];
    inStock    : number;
    price      : number;
    sizes      : string[];
    slug       : string;
    tags       : string[];
    title      : string;
    type       : string;
    gender     : string;
}

interface Props {
    product: IProduct;
}

const ProductAdminPage:FC<Props> = ({ product }) => {

    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm<FormData>({
        defaultValues: product
    });
    
    const [newTagValue, setNewTagValue] = useState('')

    const onDeleteSize = ( size: string ) => {
        // console.log({ size });
        const currentSizes = getValues('sizes');
        if ( currentSizes.includes(size) ) {
            setValue('sizes', currentSizes.filter(s => s !== size ), { shouldValidate: true })
        } else {
            setValue('sizes', [ ...currentSizes, size ], { shouldValidate: true })
        }
        
    }

    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();
        const currentTags = getValues('tags');
        if ( currentTags.includes(newTag) ){
            return;
        }
        currentTags.push( newTag );
        setNewTagValue('');
    }

    const onDeleteTag = ( tag: string ) => {
        const updatedTags = getValues('tags').filter( t => t !== tag );
        setValue('tags', updatedTags, { shouldValidate: true });
    }

    const onSubmit = (form: FormData) => {
        console.log(form);
    }

    return (
        <AdminLayout 
            title={'Producto'} 
            subtitle={`Editando: ${ product.title }`}
            icon={ <DriveFileRenameOutline /> }
        >
            <form onSubmit={ handleSubmit( onSubmit ) }>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('title', {
                                required: 'Este campo es requerido',                                
                            })}
                            error={ !!errors.title }
                            helperText={ errors.title?.message }
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('description', {
                                required: 'Este campo es requerido',                                
                            })}
                            error={ !!errors.description }
                            helperText={ errors.description?.message }
                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('inStock', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Mínimo de cero' },
                            })}
                            error={ !!errors.inStock }
                            helperText={ errors.inStock?.message }
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('type') }
                                onChange={ ({ target }) => setValue('type', target.value, { shouldValidate: true } ) }
                            >
                                {
                                    validTypes.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('gender') }
                                onChange={ ({ target }) => setValue('gender', target.value, { shouldValidate: true } ) }
                            >
                                {
                                    validGender.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel 
                                        key={size} 
                                        label={ size } 
                                        control={ <Checkbox checked={ getValues('sizes').includes(size) } />} 
                                        onChange={ () => onDeleteSize(size) }
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={ newTagValue }
                            onChange={ ({ target }) => setNewTagValue(target.value) }
                            onKeyUp={ ({ code }) => code === 'Space' ? onNewTag() : undefined }
                        />
                        
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                getValues('tags').map((tag) => {

                                return (
                                    <ListItem key={tag} sx={{ width: '95px' }}>
                                        <Chip
                                            label={tag}
                                            onDelete={ () => onDeleteTag(tag)}
                                            color="primary"
                                            size='small'
                                        />
                                    </ListItem>
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                            >
                                Cargar imagen
                            </Button>

                            <Grid container spacing={2}>
                                {
                                    product.images.map( img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia 
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ `/products/${ img }` }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button fullWidth color="error">
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { slug = ''} = query;
    
    const product = await dbProducts.getProductBySlug(slug.toString());

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    

    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage