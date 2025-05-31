import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  CardActions
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import useAuth from 'hooks/useAuth';
import ConfirmationDialog from 'utils/alerts/Confirmation';
import { Product } from 'types/product';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const serverSpecification: Product[] = [
  {
    index: 1,
    tag: 'Best Seller',
    ram: '8 GB',
    memory: '256 GB',
    validity: '5 years',
    price: 6000
  },
  {
    index: 2,
    tag: 'Best Seller',
    ram: '8 GB',
    memory: '256 GB',
    validity: '5 years',
    price: 8000
  },
  {
    index: 3,
    tag: 'Best Seller',
    ram: '8 GB',
    memory: '256 GB',
    validity: '5 years',
    price: 9000
  },
  {
    index: 4,
    tag: 'Best Seller',
    ram: '8 GB',
    memory: '256 GB',
    validity: '5 years',
    price: 9500
  },
  {
    index: 5,
    tag: 'Best Seller',
    ram: '8 GB',
    memory: '256 GB',
    validity: '5 years',
    price: 14000
  }
];

interface userType {
  id: string;
  name: string;
  email: string;
  balance: number;
  contact: number;
  role: string;
  date: Date;
}

const productsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [seletedproduct, setSeletedproduct] = useState<Product | null | undefined>();
  const [userDetails, setUserDetails] = useState<userType>();
  const navigate = useNavigate();

  useEffect(() => {
    getUserDetails();
  }, [])

  const getUserDetails = () => {
    firebase.auth().onAuthStateChanged(async (currentuser) => {
      if (currentuser) {
        console.log("currentuser: ");
        console.log(currentuser);
        const userRef = doc(db, "users", currentuser.uid);
        const docSnap = getDoc(userRef)
        if ((await docSnap).exists()) {
          console.log("docSnap.data():" + (await docSnap).data());
          let data: userType = {
            id: currentuser.uid,
            name: (await docSnap).data()?.userName,
            email: (await docSnap).data()?.userEmail,
            contact: (await docSnap).data()?.userContact,
            balance: (await docSnap).data()?.userBalance,
            role: (await docSnap).data()?.role,
            date: (await docSnap).data()?.createdAt
          }
          setUserDetails(data)
          console.log("data: ");
          console.log(data);
          console.log("userDetails: ");
          console.log(userDetails);


        } else {
          console.log("User is not logged in");
        }
      }
    })
  }


  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirm = async () => {
    await handleBuynowClick(seletedproduct);
    handleCloseDialog();
  };

  async function handleBuynowClick(item: Product | null | undefined) {

    try {
      const currentuser: any = firebase.auth().currentUser;
      const userRef = collection(db, 'users');
      const userDocRef = doc(userRef, currentuser?.uid);
      const orderRef = collection(userDocRef, 'orders');
      const transRef = collection(userDocRef, 'transactions');

      console.log(currentuser);
      let orderDetails = {
        productId: item?.index,
        orderDate: new Date(),
        orderValue: item?.price,
        priorbalance: userDetails?.balance,
        serverUname: '',
        serverPassword: ''
      }
      console.log(orderDetails);


      if (currentuser) {
        await addDoc(orderRef, orderDetails);

        await addDoc(transRef, {
          serverSpec: item?.index,
          orderDate: new Date(),
          priorbalance: userDetails?.balance,
          orderValue: item?.price
        });

        console.log('Order data added in user doc!!! ');
        navigate('/my-orders');
      }
    } catch (error: any) {
      console.log(error.message);
    }

  }

  const { user } = useAuth();

  return (
    <>
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirm}
        title="Confirmation"
        message="Are you sure you want to proceed?"
      />
      {user?.role !== 'user' ? (
        <>
          <Box
            sx={{
              marginTop: 6,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
            gap={3}
          >
            {serverSpecification.map((item) => (
              <Card
                key={item.index}
                sx={[
                  {
                    minWidth: 345,
                    minHeight: 400,
                    p: 2,
                    ':hover': { bgcolor: '#e9d6ff' }
                  }
                ]}
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    <Chip variant="outlined" color="info" icon={<BookmarkIcon />} label={item.tag} />
                  </Typography>
                  <Typography
                    sx={{
                      marginTop: 4,
                      color: '#858585',
                      fontSize: 'small'
                    }}
                  >
                    Product Id: {item.index}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: 2 }}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Ram
                          </TableCell>
                          <TableCell align="right">{item.ram}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Memory
                          </TableCell>
                          <TableCell align="right">{item.memory}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Validity
                          </TableCell>
                          <TableCell align="right">{item.validity}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            Price
                          </TableCell>
                          <TableCell align="right">{item.price}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 3 }}
                    onClick={() => {
                      setSeletedproduct(item);
                      item.price > (userDetails?.balance ?? 0) ? alert("Low Balance") : handleOpenDialog();
                    }}
                  >
                    Buy Now
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead style={{ backgroundColor: '#d1d1d1' }}>
                <TableRow>
                  <TableCell style={{ maxWidth: 80 }} align="center">
                    #
                  </TableCell>
                  <TableCell style={{ minWidth: 200 }} align="left">
                    Tag
                  </TableCell>
                  <TableCell style={{ minWidth: 120 }} align="right">
                    Ram
                  </TableCell>
                  <TableCell style={{ minWidth: 120 }} align="right">
                    Memory
                  </TableCell>
                  <TableCell style={{ minWidth: 120 }} align="right">
                    Valadity
                  </TableCell>
                  <TableCell style={{ minWidth: 150 }} align="right">
                    Price
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serverSpecification.map((row) => (
                  <TableRow
                    key={row.index}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell align="center">{row.index}</TableCell>
                    <TableCell align="left">{row.tag}</TableCell>
                    <TableCell align="right">{row.ram}</TableCell>
                    <TableCell align="right">{row.memory}</TableCell>
                    <TableCell align="right">{row.validity}</TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  );
};

export default productsPage;
