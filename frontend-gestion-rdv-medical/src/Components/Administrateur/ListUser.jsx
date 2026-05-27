import { BsPencilSquare } from "react-icons/bs";
import { BsFillTrash3Fill } from "react-icons/bs";
export default function ListUsers({ Users }){
    return(
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {Users.map(user => (
                        
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.user_status}</td>
                            <td>
                                <BsPencilSquare />
                                <BsFillTrash3Fill />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}