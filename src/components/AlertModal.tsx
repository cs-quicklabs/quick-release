"use client";

import React from "react";
import Spin from "../atoms/Spin";
import { Modal } from "flowbite-react";

import { classNames } from "@/lib/utils";

type AlertModalProps = {
  show: boolean;

  containerClassName?: string;
  bodyContainerClassName?: string;
  modalSize?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";

  title?: string;
  message?: string;

  spinClassName?: string;
  okBtnClassName?: string;
  okBtnText?: string;
  onClickOk?: () => void;

  cancelBtnClassName?: string;
  cancelBtnText?: string;
  onClickCancel?: () => void;
  isCancelBtnHidden?: boolean;
  loading?: boolean;
};

const AlertModal: React.FC<AlertModalProps> = ({
  show = false,
  containerClassName = "",
  bodyContainerClassName = "",
  modalSize = "lg",

  title = "",
  message = "",

  spinClassName = "",
  okBtnClassName = "",
  okBtnText = "Yes, I'm sure",
  onClickOk,

  cancelBtnClassName = "",
  cancelBtnText = "No, cancel",
  onClickCancel,
  isCancelBtnHidden = false,

  loading = false,
}) => {
  return (
    <Modal
      show={show}
      onClose={onClickCancel}
      className={containerClassName}
      size={modalSize}
    >
      <Modal.Header>{title}</Modal.Header>

      <Modal.Body className={bodyContainerClassName}>
        <h3 className="mb-5 text-lg font-normal text-gray-500">{message}</h3>
      </Modal.Body>

      <Modal.Footer className="py-4 justify-end">
        {!isCancelBtnHidden && (
          <button
            className={classNames(
              "py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100",
              cancelBtnClassName
            )}
            type="button"
            onClick={onClickCancel}
          >
            {cancelBtnText}
          </button>
        )}

        <button
          className={classNames(
            "ms-3 text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center",
            loading && "opacity-75 cursor-not-allowed",
            okBtnClassName
          )}
          type="button"
          onClick={loading ? undefined : onClickOk}
          disabled={loading}
        >
          {loading && (
            <Spin
              className={classNames(
                "inline w-4 h-4 me-3 text-white animate-spin mr-1.5",
                spinClassName
              )}
            />
          )}

          {okBtnText}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
