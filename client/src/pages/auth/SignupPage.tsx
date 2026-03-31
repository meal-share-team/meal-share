import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

// Page for creating an account with meal share for both restaurants and customers
// Can navigate to Landing , suggestions, and login pages

function SignupPage() {
    const navigate = useNavigate();

    const handleSignup = async (formData: FormData) => {
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");
        const role = String(formData.get("role") ?? "CUSTOMER");

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { role }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        navigate("/login");
    };

    return (
        <section>
            <h1>Sign Up</h1>

            <form
                onSubmit={(e) => {
                e.preventDefault();
                void handleSignup(new FormData(e.currentTarget));
                }}
            >
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />

                <select title="role" defaultValue="CUSTOMER">
                    <option value="CUSTOMER">Customer</option>
                    <option value="OWNER">Restaurant Owner</option>
                </select>

                <button type="submit">Create Account</button>
            </form>

            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </section>
    );
}

export default SignupPage;