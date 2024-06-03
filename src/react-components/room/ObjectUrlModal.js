import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { TextInputField } from "../input/TextInputField";
import { useForm } from "react-hook-form";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";
import { IconButton } from "../input/IconButton";
import styles from "./ObjectUrlModal.scss";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";

export function ObjectUrlModal({ showModelCollectionLink, modelCollectionUrl, onSubmit, onClose }) {
  const {
    handleSubmit,
    register,
    watch,
    resetField,
    formState: { errors }
  } = useForm();

  const file = watch("file");
  const hasFile = file && file.length > 0;
  const fileName = hasFile ? file[0].name : undefined;

  const onClear = useCallback(() => {
    resetField("url");
    resetField("file");
  }, [resetField]);

  const url = watch("url", "");

  const validateFiles = file => {
    if (!file || file.length=== 0) return true; // ファイルが選択されていない場合はチェックしない
    const supportedFormats = ["pdf","png", "jpg", "gif", "mp4", "mp3","glb"];
    const extension = file[0].name.split('.').pop().toLowerCase();
    return supportedFormats.includes(extension) || "pdf,png,jpg,gif,mp4,mp3,glbのいずれかの形式でアップロードしてください。";
  };

  const showCloseButton = hasFile || url.length > 0;

  return (
    <Modal
      title={<FormattedMessage id="object-url-modal.title" defaultMessage="Custom Object" />}
      beforeTitle={<CloseButton onClick={onClose} />}
    >
      <Column as="form" padding center onSubmit={handleSubmit(onSubmit)}>
        <p className={styles.text}>
          {showModelCollectionLink ? (
            <FormattedMessage
              id="object-url-modal.message-with-collection"
              defaultMessage="Upload or paste a link to an image, video, model, or scene. Models can be found on <sketchfablink>Sketchfab</sketchfablink> or in our <collectionlink>collection</collectionlink>."
              values={{
                // eslint-disable-next-line react/display-name
                sketchfablink: chunks => (
                  <a
                    href="https://sketchfab.com/search?features=downloadable&type=models"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                ),
                // eslint-disable-next-line react/display-name
                collectionlink: chunks => (
                  <a href={modelCollectionUrl} target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                )
              }}
            />
          ) : (
            <FormattedMessage
              id="object-url-modal.message"
              defaultMessage="Upload or paste a link to an image, video, model, or scene. Models can be found on <sketchfablink>Sketchfab</sketchfablink>."
              values={{
                // eslint-disable-next-line react/display-name
                sketchfablink: chunks => (
                  <a
                    href="https://sketchfab.com/search?features=downloadable&type=models"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chunks}
                  </a>
                )
              }}
            />
          )}
        </p>
        <TextInputField
          label={<FormattedMessage id="object-url-modal.url-field-label" defaultMessage="Object URL or File" />}
          placeholder="ファイルを選択してください。"
          type={hasFile ? "text" : "url"}
          value={fileName || url || ""}
          {...register("url")}
          error={hasFile ? errors?.file?.message : errors?.url?.message}
          fullWidth
          className={styles.input}
          afterInput={
            <>
              {showCloseButton && <CloseButton onClick={onClear} className={styles.close} />}
              <IconButton
                as="label"
                className={classNames({ [styles.hidden]: showCloseButton }, styles.urlInput, styles.container)}
                htmlFor="file"
              >
                {!showCloseButton && (
                  <div className={styles.browse}>
                    <span>
                      <FormattedMessage id="object-url-modal.browse" defaultMessage="ファイル選択" />
                    </span>
                  </div>
                )}
                {/* <input id="file" className={styles.hidden} type="file" {...register("file")} /> */}
                <input id="file" {...register("file", { validate: validateFiles })} className={styles.hidden} type="file" />
              </IconButton>
            </>
          }
          description={
            <FormattedMessage
              id="object-url-modal.url-field-description"
              defaultMessage="Accepts pdf, png, jpg, gif, mp4, and mp3, 'glb' files"
            />
          }
        />
        <Button type="submit" preset="accent4">
          <FormattedMessage id="object-url-modal.create-object-button" defaultMessage="Create Object" />
        </Button>
      </Column>
    </Modal>
  );
}

ObjectUrlModal.propTypes = {
  isMobile: PropTypes.bool,
  showModelCollectionLink: PropTypes.bool,
  modelCollectionUrl: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
};
