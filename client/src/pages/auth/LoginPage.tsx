import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Page for existing users to login to their accounts
// Can navigate to langing, suggestions, and signup pages

function LoginPage() {
    const navigate = useNavigate();

    const handleEmailLogin = async (formData: FormData) => {
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert(error.message);
            return;
        }

        const role = (data.user?.user_metadata.role ?? "CUSTOMER") as string;
        navigate(role === "OWNER" ? "/owner" : "/app");
    };

    const handleOAuthLogin = async (provider: "google" | "github") => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/app`
            }
        });
    };

    return (
        <section>
            <h1>Login</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    void handleEmailLogin(new FormData(e.currentTarget));
                }}
            >
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Login</button>
            </form>

            <button onClick={() => void handleOAuthLogin("google")}>
                Continue with Google
            </button>
            {/* <button onClick={() => void handleOAuthLogin("github")}>
                Continue with GitHub
            </button> */}

            <p>
                No account? <Link to="/signup">Sign up</Link>
            </p>
        </section>
    );
}

export default LoginPage;