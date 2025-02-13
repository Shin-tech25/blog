import React from "react";
import { useForm } from "react-hook-form";
import Layout from "../components/layout";
import Seo from "../components/seo";
import * as styles from "../styles/contact.module.css";

const ContactPage = ({ location }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            console.log("Sending data:", data);

            const response = await fetch('https://blog.mshin0509.com/api/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("Response data:", result); 
            alert(result.message);
            reset(); // フォームをリセット
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            alert('お問い合わせの送信中にエラーが発生しました。');
        }
    };

    return (
        <Layout location={location}>
            <Seo title="Contact" />
            <p className={styles.intro}>お仕事の依頼や記事に関することなどは以下のフォームからどうぞ。</p>
            <div className={styles.container}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            rows="6"  // 追加: テキストエリアの行数を増やす
                            {...register("message", { required: "Message is required" })}
                        />
                        {errors.message && <p className={styles.error}>{errors.message.message}</p>}
                    </div>
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </form>
            </div>
        </Layout>
    );
};

export default ContactPage;

export const Head = () => <Seo title="Contact" />;