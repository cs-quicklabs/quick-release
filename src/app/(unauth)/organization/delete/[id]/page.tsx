"use client";

import { PagePayloadType } from "@/types";
import React, { use, useEffect } from "react";

const DeleteOrganization = (props: PagePayloadType) => {
  const [message, setMessage] = React.useState("");

  const params = props.params;
  const { id } = use(params);

  useEffect(() => {
    const deleteOrg = async () => {
      const response = await fetch(`/api/organization`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationCuid: id,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage(
          responseData?.message ?? "Organization deleted successfully"
        );
      } else {
        setMessage(responseData?.message ?? "Failed to delete organization");
        console.error("Failed to delete organization", responseData);
      }
    };

    deleteOrg();
  }, [id]);

  return <div>{message}</div>;
};

export default DeleteOrganization;
