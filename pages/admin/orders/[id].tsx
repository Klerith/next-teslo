import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PayPalButtons } from '@paypal/react-paypal-js';

import { Box, Card, CardContent, Divider, Grid, Typography, Chip, CircularProgress } from '@mui/material';
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { ShopLayout } from '../../../components/layouts/ShopLayout';
import { CartList, OrderSummary } from '../../../components/cart';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';
import { tesloApi } from '../../../api';
import { AdminLayout } from '../../../components/layouts';



interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {


    const { shippingAddress } = order;
    const [isPaying, setIsPaying] = useState(false);


  return (
    <AdminLayout title='Detalles de la orden' subtitle={`Orden: ${ order._id }`} >

        {
            order.isPaid
            ? (
                <Chip 
                    sx={{ my: 2 }}
                    label="Orden ya fue pagada"
                    variant='outlined'
                    color="success"
                    icon={ <CreditScoreOutlined /> }
                />
            ):
            (
                <Chip 
                    sx={{ my: 2 }}
                    label="Pendiente de pago"
                    variant='outlined'
                    color="error"
                    icon={ <CreditCardOffOutlined /> }
                />
            )
        }

        

        <Grid container className='fadeIn'>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList products={  order.orderItems } />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({ order.numberOfItems } { order.numberOfItems > 1 ? 'productos': 'producto'})</Typography>
                        <Divider sx={{ my:1 }} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                        </Box>

                        
                        <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                        <Typography>{ shippingAddress.address } { shippingAddress.address2 ? `, ${ shippingAddress.address2 }`: '' }</Typography>
                        <Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
                        <Typography>{ shippingAddress.country }</Typography>
                        <Typography>{ shippingAddress.phone }</Typography>

                        <Divider sx={{ my:1 }} />


                        <OrderSummary 
                            orderValues={{
                                numberOfItems: order.numberOfItems,
                                subTotal: order.subTotal,
                                total: order.total,
                                tax: order.tax,
                            }} 
                        />

                        <Box sx={{ mt: 3 }} display="flex" flexDirection='column'>


                            <Box flexDirection='column' sx={{ display: isPaying ? 'none': 'flex', flex: 1 }} >
                                {
                                    order.isPaid
                                    ? (
                                        <Chip 
                                            sx={{ my: 2 }}
                                            label="Orden ya fue pagada"
                                            variant='outlined'
                                            color="success"
                                            icon={ <CreditScoreOutlined /> }
                                        />

                                    ):(
                                        <Chip 
                                            sx={{ my: 2 }}
                                            label="No Pagada"
                                            variant='outlined'
                                            color="error"
                                            icon={ <CreditCardOffOutlined /> }
                                        />
                                    )
                                }
                            </Box>

                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>


    </AdminLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const { id = '' } = query;
    const order = await dbOrders.getOrderById( id.toString() );

    return {
        props: {
            order
        }
    }
}


export default OrderPage;