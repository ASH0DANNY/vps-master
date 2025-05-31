import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import firebase from 'firebase/compat/app';
import { db } from 'firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

interface Order {
    id: string;
    orderDate: Date;
    orderValue: number;
    priorbalance: number;
    productId: number;
    serverPassword: string;
    serverUname: string;
}

const myOrdersPage = () => {
    const [userOrders, setUserOrders] = useState<Order[]>();

    useEffect(() => {
        fetchOrderData();
    }, []);

    const fetchOrderData = () => {
        // const user = auth.currentUser;
        firebase.auth().onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                try {
                    const userRef = collection(db, 'users');
                    const docRef = doc(userRef, currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    const ordersRef = collection(docRef, 'orders');

                    if (docSnap.exists()) {
                        const orderSnap = await getDocs(ordersRef);

                        if (orderSnap) {
                            let temp: Order[] = orderSnap.docs.map((doc) => ({
                                id: doc.id,
                                orderDate: doc.data().orderDate,
                                orderValue: doc.data().orderValue,
                                priorbalance: doc.data().priorbalance,
                                productId: doc.data().productId,
                                serverUname: doc.data().serverUname,
                                serverPassword: doc.data().serverPassword,
                            }));
                            if (temp) {
                                console.log(temp);
                                setUserOrders(temp);
                            } else {
                                console.log('No order found for this user');
                            }
                            setUserOrders(temp);

                            console.log('userOrders: ');
                            console.log(userOrders);
                        } else {
                            console.log('No order found of this user');
                        }
                    } else {
                        console.log('User is not logged in');
                    }
                } catch (error: any) {
                    console.log(error.message);
                }
            } else {
                console.log('User is not logged in');
            }
        });
    };

    return (
        <>
            <Typography>Orderrrssss</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead style={{ backgroundColor: '#d1d1d1' }}>
                        <TableRow>
                            <TableCell style={{ maxWidth: 180 }} align="center">
                                #
                            </TableCell>
                            <TableCell style={{ minWidth: 120 }} align="center">
                                Date
                            </TableCell>
                            <TableCell style={{ minWidth: 120 }} align="center">
                                OrderValue
                            </TableCell>
                            <TableCell style={{ minWidth: 120 }} align="center">
                                ProductId
                            </TableCell>
                            <TableCell style={{ minWidth: 120 }} align="center">
                                Status
                            </TableCell>
                            <TableCell style={{ minWidth: 180 }} align="center">
                                S Username
                            </TableCell>
                            <TableCell style={{ minWidth: 180 }} align="center">
                                S Password
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {userOrders !== null || undefined ? (
                        <TableBody>
                            {userOrders?.map((row: any) => (
                                <TableRow
                                    key={row.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 }
                                    }}
                                >
                                    <TableCell align="center">{row.id}</TableCell>
                                    <TableCell align="center">{row.orderDate}</TableCell>
                                    <TableCell align="center">{row.orderValue}</TableCell>
                                    <TableCell align="center">{row.productId}</TableCell>
                                    <TableCell align="center">
                                        {row.serverUname === '' ? (
                                            <Chip
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                label="pending"
                                                icon={<FiberManualRecordIcon fontSize="small" />}
                                            />
                                        ) : (
                                            <Chip
                                                variant="outlined"
                                                color="success"
                                                size="small"
                                                label="completed"
                                                icon={<FiberManualRecordIcon fontSize="small" />}
                                            />
                                        )}
                                    </TableCell>

                                    <TableCell align="center">{row.serverUname}</TableCell>
                                    <TableCell align="center">{row.serverPassword}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>No data to show here</TableBody>
                    )}
                </Table>
            </TableContainer>
        </>
    );
};

export default myOrdersPage;
