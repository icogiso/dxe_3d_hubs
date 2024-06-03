import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as VideoIcon } from "../icons/Video.svg";
import { ReactComponent as DesktopIcon } from "../icons/Desktop.svg";
import { ReactComponent as AvatarIcon } from "../icons/Avatar.svg";
import { ReactComponent as UploadIcon } from "../icons/Upload.svg";
import { SharePopoverButton } from "./SharePopover";
import { ObjectUrlModalContainer } from "./ObjectUrlModalContainer";
import { FormattedMessage } from "react-intl";
import useAvatar from "./hooks/useAvatar";
import { MediaDevicesEvents, MediaDevices } from "../../utils/media-devices-utils";

function useShare(scene, hubChannel) {
  const mediaDevicesManager = APP.mediaDevicesManager;
  const [sharingSource, setSharingSource] = useState(null);
  const [canShareCamera, setCanShareCamera] = useState(false);
  const [canShareScreen, setCanShareScreen] = useState(false);
  const [canShareCameraToAvatar, setCanShareCameraToAvatar] = useState(false);
  const { hasVideoTextureTarget } = useAvatar();

  useEffect(() => {
    function onShareVideoEnabled(event) {
      setSharingSource(event.detail.source);
    }

    function onShareVideoDisabled() {
      setSharingSource(null);
    }

    function onPermissionsUpdated() {
      const canShareMedia = hubChannel.can("spawn_and_move_media");
      console.log("Permissions updated - canShareMedia:", canShareMedia);

      if (canShareMedia) {
        navigator.mediaDevices
          .enumerateDevices()
          .then(devices => {
            const hasCamera = devices.some(device => device.kind === "videoinput");
            console.log("Devices enumerated - hasCamera:", hasCamera);
            setCanShareCamera(hasCamera);
            setCanShareCameraToAvatar(hasCamera && hasVideoTextureTarget);
          })
          .catch(() => {
            console.log("Failed to enumerate devices");
            setCanShareCamera(false);
            setCanShareCameraToAvatar(false);
          });

        setCanShareScreen(!!navigator.mediaDevices.getDisplayMedia);
      } else {
        setCanShareScreen(false);
        setCanShareCamera(false);
        setCanShareCameraToAvatar(false);
      }
    }

    scene.addEventListener("share_video_enabled", onShareVideoEnabled);
    scene.addEventListener("share_video_disabled", onShareVideoDisabled);
    scene.addEventListener("share_video_failed", onShareVideoDisabled);
    hubChannel.addEventListener("permissions_updated", onPermissionsUpdated);

    onPermissionsUpdated();

    setSharingSource(
      mediaDevicesManager.isVideoShared
        ? mediaDevicesManager.isWebcamShared
          ? MediaDevices.CAMERA
          : MediaDevices.SCREEN
        : null
    );

    return () => {
      scene.removeEventListener("share_video_enabled", onShareVideoEnabled);
      scene.removeEventListener("share_video_disabled", onShareVideoDisabled);
      scene.removeEventListener("share_video_failed", onShareVideoDisabled);
      hubChannel.removeEventListener("permissions_updated", onPermissionsUpdated);
    };
  }, [scene, hubChannel, hasVideoTextureTarget, mediaDevicesManager]);

  const toggleShareCamera = useCallback(() => {
    if (sharingSource) {
      scene.emit(MediaDevicesEvents.VIDEO_SHARE_ENDED);
    } else {
      scene.emit("action_share_camera");
    }
  }, [scene, sharingSource]);

  const toggleShareScreen = useCallback(() => {
    if (sharingSource) {
      scene.emit(MediaDevicesEvents.VIDEO_SHARE_ENDED);
    } else {
      scene.emit("action_share_screen");
    }
  }, [scene, sharingSource]);

  const toggleShareCameraToAvatar = useCallback(() => {
    if (sharingSource) {
      scene.emit(MediaDevicesEvents.VIDEO_SHARE_ENDED);
    } else {
      scene.emit("action_share_camera", { target: "avatar" });
    }
  }, [scene, sharingSource]);

  return {
    sharingSource,
    canShareCamera,
    canShareCameraToAvatar,
    canShareScreen,
    toggleShareCamera,
    toggleShareCameraToAvatar,
    toggleShareScreen
  };
}

export function SharePopoverContainer({ scene, hubChannel, showNonHistoriedDialog }) {
  const {
    sharingSource,
    canShareCamera,
    toggleShareCamera,
    canShareScreen,
    toggleShareScreen,
    canShareCameraToAvatar,
    toggleShareCameraToAvatar
  } = useShare(scene, hubChannel);

  const [items, setItems] = useState([]);

  useEffect(() => {
    function updateItems() {
      const newItems = [
        canShareScreen && {
          id: "screen",
          icon: DesktopIcon,
          color: "accent5",
          label: <FormattedMessage id="share-popover.source.screen" defaultMessage="Screen" />,
          onSelect: toggleShareScreen,
          active: sharingSource === MediaDevices.SCREEN
        },
        hubChannel.can("spawn_and_move_media") && {
          id: "upload",
          icon: UploadIcon,
          color: "accent5",
          label: <FormattedMessage id="place-popover.item-type.upload" defaultMessage="Upload" />,
          onSelect: () => showNonHistoriedDialog(ObjectUrlModalContainer, { scene }),
          active: sharingSource === MediaDevices.SCREEN
        },
        canShareCamera && {
          id: "camera",
          icon: VideoIcon,
          color: "accent5",
          label: <FormattedMessage id="share-popover.source.camera" defaultMessage="Camera" />,
          onSelect: toggleShareCamera,
          active: sharingSource === MediaDevices.CAMERA
        },
        canShareCameraToAvatar && {
          id: "camera-to-avatar",
          icon: AvatarIcon,
          color: "accent5",
          label: <FormattedMessage id="share-popover.source.avatar-camera" defaultMessage="Avatar Camera" />,
          onSelect: toggleShareCameraToAvatar,
          active: sharingSource === "camera-to-avatar"
        }
      ].filter(Boolean);

      console.log("Updated items:", newItems);
      setItems(newItems);
    }

    updateItems();

    hubChannel.addEventListener("permissions_updated", updateItems);

    return () => {
      hubChannel.removeEventListener("permissions_updated", updateItems);
    };
  }, [
    canShareScreen,
    canShareCamera,
    canShareCameraToAvatar,
    sharingSource,
    toggleShareScreen,
    toggleShareCamera,
    toggleShareCameraToAvatar,
    hubChannel,
    showNonHistoriedDialog,
    scene
  ]);

  return <SharePopoverButton items={items} />;
}

SharePopoverContainer.propTypes = {
  hubChannel: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  showNonHistoriedDialog: PropTypes.func.isRequired
};
