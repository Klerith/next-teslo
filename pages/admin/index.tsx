import { useState, useEffect } from 'react';
import { DashboardOutlined, CreditCardOffOutlined, CreditCardOutlined, AttachMoneyOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import useSWR from 'swr';
import { SummaryTile } from '../../components/admin';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { DashboardSummaryResponse } from '../../interfaces';


const Dashboard = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>(`/api/admin/dashboard`, {
    refreshInterval: 30 * 1000 // 30 segundos
  });

  const [refreshIn, setRefreshIn] = useState(30);
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('tick')
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 );
    }, 1000 );

    return () => clearInterval(interval);
  }, [])
  

  if ( !error && !data ) {
    return <></>
  }

  if ( error ) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data!;


  return (
    <AdminLayout 
      title='Dashboard' 
      subtitle='Estadísticas generales'
      icon={<DashboardOutlined />}
    >

      <Grid container spacing={2}>
        {/* <Grid item xs={6} sm={3}>
          <Card sx={{ display: 'flex' }}>
            <CardContent sx={{ width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <CreditCardOffOutlined color='secondary' fontSize='large'/>
            </CardContent>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography variant='h3'>Total: 55 </Typography>
                <Typography variant='caption'>Ordenes </Typography>
            </CardContent>
          </Card>
        </Grid> */}

        <SummaryTile 
          title={ numberOfOrders }
          subTitle='Ordenes totales'
          icon={ <CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ paidOrders }
          subTitle='Ordenes Pagadas'
          icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 45 }} /> }
        />

        <SummaryTile 
          title={ notPaidOrders }
          subTitle='Ordenes Pendientes'
          icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ numberOfClients }
          subTitle='Clientes'
          icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ numberOfProducts }
          subTitle='Products'
          icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ productsWithNoInventory }
          subTitle='Sin existencias'
          icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ lowInventory }
          subTitle='Bajo inventario'
          icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ refreshIn }
          subTitle='Actualización en'
          icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />

      </Grid>
    </AdminLayout>
  )
}

export default Dashboard