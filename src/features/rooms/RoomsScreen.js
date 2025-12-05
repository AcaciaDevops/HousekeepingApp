// src/features/rooms/RoomsScreen.js
import React,{useEffect,useState} from "react";
import RoomCard from "../../components/rooms/RoomCard";
import { View, FlatList, StyleSheet ,ActivityIndicator} from "react-native";
import { fetchRooms,updateRoomStatus } from "../../api/RoomApi";

export default function RoomsScreen() {
      const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
  
   useEffect(() => {
      async function loadRooms() {
        try {
          const data = await fetchRooms();
          console.log("Rooms loaded in room screen:", data);
          setRooms(data || []);
         
        } catch (err) {
          console.error("Failed to load rooms:", err);
        } finally {
          setLoading(false);
        }
      }
  
      loadRooms();
    }, []);
  async function handleRoomStatusChange(roomId, newStatus) {
  try {
    // 1. Hit update API
    await updateRoomStatus(roomId, newStatus);

    // 2. Update local state
    setRooms(prev =>
      prev.map(r =>
        r.room_id === roomId ? { ...r, room_status: newStatus } : r
      )
    );
  } catch (err) {
    console.log("Failed to update room status:", err);
  }
}

    if (loading) {
      return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
    }
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.room_id.toString()}
        renderItem={({ item }) => <RoomCard room={item} onStatusChange={handleRoomStatusChange} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
