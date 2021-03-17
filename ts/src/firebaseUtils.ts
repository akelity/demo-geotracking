import firebase from "firebase";


const login = (auth: firebase.auth.Auth, provider: firebase.auth.AuthProvider) => {
    auth.languageCode = 'it';
    auth.signInWithPopup(provider).then((result: firebase.auth.UserCredential) => {
        console.log("Login Successful: ", result);
    }).catch((error: any) => {
        console.error("Login error: ", error);
    });
}

const logout = (auth: firebase.auth.Auth) => {
    auth.signOut().then(() => {
        console.log("Logout Successful");
    }).catch((error: any) => {
        console.error("Logout error: ", error);
    });
}

const watchLogin = (auth: firebase.auth.Auth, doLogin: Function, doLogout: Function) => {
    auth.onAuthStateChanged((user: firebase.User | null) => {
        if (user) {
            doLogin(user);
        } else {
            doLogout();
        }
    });
}

const watchDatabase = (database: firebase.database.Database, updateMarker: Function) => {
    database.ref('users').on('value', (snapshot: firebase.database.DataSnapshot) => {
        const data = snapshot.val();
        updateMarker(data);
    });
}

export {
    login,
    logout,
    watchLogin,
    watchDatabase
}