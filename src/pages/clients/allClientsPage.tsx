
import { Typography, Button } from '@mui/material'
import useAuth from 'hooks/useAuth';
import firebase from 'firebase/compat/app';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';

const AllClientsPage = () => {

    const { user } = useAuth();
    return (
        <>
            <Typography>user details</Typography>
            <Button variant='contained' onClick={() => {
                firebase.auth().onAuthStateChanged(async (currentuser) => {
                    if (currentuser) {
                        console.log("currentuser: ");
                        console.log(currentuser);
                        const userRef = doc(db, "users", currentuser.uid);
                        const userDetails = getDoc(userRef)
                        if ((await userDetails).exists()) {
                            console.log("docSnap.data():" + (await userDetails).data());

                            console.log((await userDetails).data());
                        } else {
                            console.log("User is not logged in");
                        }
                    }
                })
                console.log("state.user: ");

                console.log(user);

            }} >Get user</Button>

        </>
    )
}

export default AllClientsPage