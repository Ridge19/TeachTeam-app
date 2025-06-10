// footer component
import React from "react";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();

    // Check if user is signed in by checking for a token in localStorage
    // and optionally, you could decode the token to check the email.
    // For simplicity, we'll just check for the token.
    const [signedIn, setSignedIn] = React.useState(false);

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            setSignedIn(!!token);
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        setSignedIn(false);
        router.push("/");
    };

    return (
        <header className="header">
            <p>Admin Panel</p>
            {signedIn && (
                <button type="button" className="sign-out" style={{ marginBottom: "24px" }} onClick={handleSignOut}>
                    Sign Out
                </button>
            )}
        </header>
    );
};

export default Header;