import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../hooks/useAuth";

const schema = Yup.object().shape({
  user_email: Yup.string().email("Invalid email").required("Required"),
  user_password: Yup.string().min(4).required("Required"),
});

export default function LoginScreen() {
  const auth = useAuth();
  return (
    <View style={styles.container}>
      <Title style={{ marginBottom: 20 }}>Acacia PMS</Title>
      <Formik
        initialValues={{ user_email: "", user_password: "" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const result = await auth.login(values);
          setSubmitting(false);
          if (result.success) {
            // TODO: navigate based on user.role or default flow
            Alert.alert("Login successful");
          } else {
            console.error(result.error);
            Alert.alert("Login failed", result.error?.message || "Unknown error");
          }
        }}
      >
        {({ handleChange, handleSubmit, values }) => (
          <>
            <TextInput
              label="Email"
              value={values.user_email}
              onChangeText={handleChange("user_email")}
              style={{ marginBottom: 12 }}
              autoCapitalize="none"
            />
            <TextInput
              label="Password"
              value={values.user_password}
              onChangeText={handleChange("user_password")}
              secureTextEntry
              style={{ marginBottom: 12 }}
            />
            <Button mode="contained" loading={auth.isLoading} onPress={() => handleSubmit()}>
              Login
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
});
