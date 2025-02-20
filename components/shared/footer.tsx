import { APP_NAME } from "@/lib/constants";


const Footer = () => {
    const currentYear = new Date().getFullYear();
    return <footer className="border-t">
        <div className="wrapper">
            <div className="py-4 text-center">
                <p>&copy; {currentYear} {APP_NAME}. All rights reserved</p>
            </div>
        </div>
    </footer>;
}
 
export default Footer;