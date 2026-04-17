import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import useAuth from "../hooks/useAuth";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useAppTheme } from "../../../context/ThemeContext";
import { useThemedStyles } from "../../../utils/useThemedStyles";

const schema = Yup.object().shape({
  user_email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  user_password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

export default function AuthLogin({
  isDemo,
  showPassword: externalShowPassword,
  onTogglePassword,
}) {
  const auth = useAuth();
  const { tokens } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const [showPassword, setShowPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState(null);
  const [submitCount, setSubmitCount] = React.useState(0);

  React.useEffect(() => {
    console.log("AuthLogin MOUNTED");
    return () => console.log("AuthLogin UNMOUNTED");
  }, []);

  React.useEffect(() => {
    console.log("🔄 Auth changed in AuthLogin:", {
      isLoading: auth.isLoading,
      user: auth.user,
    });
  }, [auth.isLoading, auth.user]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
    if (onTogglePassword) onTogglePassword();
  };

  const handleSubmitPress = () => {
    console.log("📤 Submit pressed, submit count:", submitCount + 1);
    setSubmitCount((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{ user_email: "", user_password: "" }}
        validationSchema={schema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          setServerError(null);

          console.log("Attempting login with:", values.user_email);
          const result = await auth.login(values);

          if (result.success === true) {
            console.log("Login successful");
            setServerError(null);
            resetForm();
          } else {
            console.log("Login failed:", result.error);
            const errorMessage = result.error?.message || "Login failed";
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
            {serverError && (
              <View style={styles.serverErrorContainer}>
                <AntDesign
                  name="warning"
                  color={tokens.error || "#ff4444"}
                  size={16}
                />
                <Text
                  style={[
                    styles.serverErrorText,
                    { color: tokens.error || "#ff4444" },
                  ]}
                >
                  {serverError}
                </Text>
              </View>
            )}

            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: tokens.text }]}>
                Email address
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.user_email && touched.user_email && styles.inputError,
                ]}
              >
                <AntDesign
                  name="mail"
                  color={tokens.icon}
                  size={18}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  value={values.user_email}
                  onChangeText={handleChange("user_email")}
                  onBlur={handleBlur("user_email")}
                  placeholder="Enter your email"
                  placeholderTextColor={tokens.info}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  theme={{
                    colors: {
                      primary: tokens.button,
                      placeholder: tokens.info,
                      text: tokens.text,
                      surface: "transparent",
                      background: "transparent",
                    },
                  }}
                />
              </View>
              {errors.user_email && touched.user_email && (
                <Text style={styles.errorText}>{errors.user_email}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: tokens.text }]}>
                Password
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.user_password &&
                    touched.user_password &&
                    styles.inputError,
                ]}
              >
                <AntDesign
                  name="lock"
                  color={tokens.icon}
                  size={18}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={values.user_password}
                  onChangeText={handleChange("user_password")}
                  onBlur={handleBlur("user_password")}
                  placeholder="Enter your password"
                  placeholderTextColor={tokens.info}
                  autoCapitalize="none"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  theme={{
                    colors: {
                      primary: tokens.button,
                      placeholder: tokens.info,
                      text: tokens.text,
                      surface: "transparent",
                      background: "transparent",
                    },
                  }}
                />
                <AntDesign
                  name={"eye"}
                  color={tokens.icon}
                  size={18}
                  style={styles.eyeIcon}
                  onPress={handleClickShowPassword}
                />
              </View>
              {errors.user_password && touched.user_password && (
                <Text style={styles.errorText}>{errors.user_password}</Text>
              )}
            </View>

            <Button
              mode="contained"
              loading={auth.isLoading || isSubmitting}
              onPress={() => {
                handleSubmitPress();
                handleSubmit();
              }}
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
              buttonColor={tokens.button}
              textColor={tokens.buttonText}
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

const createStyles = (tokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 2,
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    fieldContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      height: 50,
      borderWidth: 1,
      borderColor: tokens.border,
      borderRadius: 8,
      backgroundColor: tokens.blockSecondary,
      overflow: "hidden",
    },
    inputError: {
      borderColor: "#ff4444",
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
      color: tokens.text,
      backgroundColor: "transparent",
    },
    loginButton: {
      borderRadius: 8,
      marginTop: 10,
      paddingVertical: 5,
    },
    loginButtonLabel: {
      fontSize: 18,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    errorText: {
      color: "#ff4444",
      fontSize: 12,
      marginTop: 5,
      marginLeft: 5,
    },
    serverErrorContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffebee",
      padding: 12,
      borderRadius: 8,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: "#ffcdd2",
    },
    serverErrorText: {
      fontSize: 14,
      marginLeft: 10,
      flex: 1,
    },
  });
