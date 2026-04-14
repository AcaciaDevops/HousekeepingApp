import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import useAuth from "../hooks/useAuth";
import AntDesign from 'react-native-vector-icons/AntDesign';

const schema = Yup.object().shape({
    user_email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    user_password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is required"),
});

export default function AuthLogin({ isDemo, showPassword: externalShowPassword, onTogglePassword }) {
    const auth = useAuth();
    const [showPassword, setShowPassword] = React.useState(false);
    const [serverError, setServerError] = React.useState(null);
     const [submitCount, setSubmitCount] = React.useState(0);
    React.useEffect(() => {
        console.log("AuthLogin MOUNTED");
        return () => console.log("AuthLogin UNMOUNTED");
    }, []);
     // Track auth changes
    React.useEffect(() => {
        console.log("🔄 Auth changed in AuthLogin:", { 
            isLoading: auth.isLoading, 
            user: auth.user 
        });
    }, [auth.isLoading, auth.user]);
    

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
        if (onTogglePassword) onTogglePassword();
    };
    const handleSubmitPress = () => {
        console.log("📤 Submit pressed, submit count:", submitCount + 1);
        setSubmitCount(prev => prev + 1);
    };
    return (
        <View style={styles.container}>
            <Formik
                initialValues={{ user_email: "", user_password: "" }}
                validationSchema={schema}
                validateOnChange={true}
                validateOnBlur={true}
                onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
                    setSubmitting(true);
                    setServerError(null);
                    
                    console.log("Attempting login with:", values.user_email);
                    const result = await auth.login(values);
                    
                    if (result.success === true) {
                        console.log("Login successful");
                        setServerError(null);
                        resetForm();
                        // Navigate based on role
                        // navigation.navigate(result.user?.role === 'admin' ? 'AdminDashboard' : 'Home');
                    } else {
                        console.log("Login failed:", result.error);
                        const errorMessage = result.error.message || "Login failed";
                          setServerError(errorMessage);
                                          }
                    setSubmitting(false);
                }}
            >
                {({ 
                    handleChange, 
                    handleBlur,
                    handleSubmit, 
                    values, 
                    errors, 
                    touched,
                    isSubmitting,
                }) => (
                    <>
                    {console.log("serverError::",serverError)}
                        {/* Server Error Display */}
                        {serverError && (
                            <View style={styles.serverErrorContainer}>
                                <AntDesign name="warning" color="#ff4444" size={16} />
                                <Text style={styles.serverErrorText}>{serverError}</Text>
                            </View>
                        )}
                        
                        {/* Email Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Email address</Text>
                            <View style={[
                                styles.inputContainer,
                                (errors.user_email && touched.user_email) && styles.inputError
                            ]}>
                                <AntDesign name="mail" color="#999" size={18} style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    value={values.user_email}
                                    onChangeText={handleChange("user_email")}
                                    onBlur={handleBlur("user_email")}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    underlineColorAndroid="transparent"
                                    theme={{ colors: { primary: 'transparent' } }}
                                />
                            </View>
                            {errors.user_email && touched.user_email && (
                                <Text style={styles.errorText}>{errors.user_email}</Text>
                            )}
                        </View>

                        {/* Password Field */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.label}>Password</Text>
                            <View style={[
                                styles.inputContainer,
                                (errors.user_password && touched.user_password) && styles.inputError
                            ]}>
                                <AntDesign name="lock" color="#999" size={18} style={styles.icon} />
                                <TextInput
                                    style={styles.input}
                                    secureTextEntry={!showPassword}
                                    value={values.user_password}
                                    onChangeText={handleChange("user_password")}
                                    onBlur={handleBlur("user_password")}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#999"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    underlineColorAndroid="transparent"
                                    theme={{ colors: { primary: 'transparent' } }}
                                />
                                <AntDesign 
                                    name={showPassword ? "eye" : "eyeo"} 
                                    color="#999" 
                                    size={18} 
                                    style={styles.eyeIcon} 
                                    onPress={handleClickShowPassword}
                                />
                            </View>
                            {errors.user_password && touched.user_password && (
                                <Text style={styles.errorText}>{errors.user_password}</Text>
                            )}
                        </View>

                        {/* Login Button */}
                        <Button 
                            mode="contained" 
                            loading={auth.isLoading || isSubmitting} 
                            onPress={() => {
                                handleSubmitPress();  // ← Call this first to log the attempt
                                handleSubmit();       // ← Then submit the form
                            }}  
                            style={styles.loginButton}
                            disabled={auth.isLoading || isSubmitting}
                        >
                            Login
                        </Button>
                    </>
                )}
            </Formik>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingHorizontal: 2, 
        justifyContent: "center",
        backgroundColor: '#fff',
    },
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    inputError: {
        borderColor: '#ff4444',
        borderWidth: 1,
    },
    icon: {
        marginLeft: 15,
        marginRight: 5,
    },
    eyeIcon: {
        marginRight: 15,
        padding: 5,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 1,
        fontSize: 14,
        color: '#1a1a1a',
        backgroundColor: 'transparent',
    },
    loginButton: {
        backgroundColor: '#58CB92',
        borderRadius: 8,
        marginTop: 10,
        paddingVertical: 5,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    serverErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffebee',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ffcdd2',
    },
    serverErrorText: {
        color: '#ff4444',
        fontSize: 14,
        marginLeft: 10,
        flex: 1,
    },
});