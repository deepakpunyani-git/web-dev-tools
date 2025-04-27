import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USERS } from "../../graphql/queries";
import { UPDATE_USER_STATUS } from "../../graphql/mutations";

import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";

const AdminUsers = () => {


  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleString();
  };

  

  const [page, setPage] = useState(1);
  const limit = 10;

  const [statusFilter, setStatusFilter] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    variables: { status: statusFilter || null, page, limit },
    fetchPolicy: "network-only", 
  });

  const [updateUserStatus, { loading: updating }] = useMutation(UPDATE_USER_STATUS);

  const totalUsers = data?.getUsers?.totalUsers || 0;
  const users = data?.getUsers?.users || [];

  const totalPages = Math.ceil(totalUsers / limit);

  const openModal = (user) => {
    setSelectedUser(user);
    setNewStatus(user.status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setNewStatus("");
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast.error("Please select a status.");
      return;
    }
    try {
      const response = await updateUserStatus({
        variables: {
          userId: selectedUser.id,
          status: newStatus,
        },
      });

      if (response.data.updateUserStatus.success) {
        toast.success(response.data.updateUserStatus.message);
        refetch();
        closeModal();
      } else {
        toast.error(response.data.updateUserStatus.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err.message || "Error updating status");
    }
  };

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === page}
        onClick={() => setPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  if (error) return <div>Error loading users: {error.message}</div>;

  return (
    <div className="container mt-4">
      <h2>Admin User Management</h2>

      <Form.Group className="mb-3 w-25">
        <Form.Label>Status Filter</Form.Label>
        <Form.Select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1); // 
          }}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Form.Select>
      </Form.Group>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.status}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.updatedAt)}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openModal(user)}
                    >
                      Update Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination>{paginationItems}</Pagination>
          )}
        </>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update User Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleStatusUpdate}
            disabled={updating}
          >
            {updating ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers;
