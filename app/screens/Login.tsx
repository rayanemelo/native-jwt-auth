import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { onLogin, onRegister } = useAuth();

  async function getUser() {
    return await axios.get(`${API_URL}/users`);
  }

  useEffect(() => {
    getUser();
  }, []);

  async function login() {
    const result = await onLogin!(email, password);

    if (result && result.error) {
      Alert.alert("Ocorreu algum erro, tente novamente!", result.msg);
    }
  }

  async function register() {
    const result = await onRegister!(email, password);

    if (result && result.error) {
      Alert.alert("Erro ao cadastrar usuário, tente novamente! ", result.msg);
    } else {
      login();
    }
  }

  return (
    <View className="px-3 py-5 justify-center flex-1 ">
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        className="border rounded h-10 p-2 bg-white my-2"
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
        className="border rounded h-10 p-2 bg-white my-2"
      />
      <Button title="Sign in" onPress={login} />
      <Button title="Create Account" onPress={register} />
    </View>
  );
}
