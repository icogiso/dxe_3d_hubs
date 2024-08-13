import React, { useEffect } from "react";
import PropTypes from "prop-types";

// SendInviteDxe.js
// export function SendInviteDxe({ data }) {
//   console.log("SendInviteDxe mounted with data:", data); // ここでデバッグ
//   useEffect(() => {
//     console.log("SendInviteDxe mounted with data:", data);
//     const sendInvite = async () => {
//       const endpoint = "https://httpbin.org/post";
//       try {
//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify(data)
//         });

//         if (!response.ok) {
//           throw new Error(`cURL送信エラー:${response.status}`);
//         }

//         const result = await response.json();
//         console.log("成功:", result);
//       } catch (error) {
//         console.error("Failed to send invite:", error);
//       }
//     };

//     if (data) {
//       sendInvite();
//     }
//   }, [data]);

//   return null;
// }

// SendInviteDxe.propTypes = {
//   data: PropTypes.object.isRequired
// };

export function SendInviteDxe({ data }) {
  useEffect(() => {
    console.log("Received data in SendInviteDxe:", data); // dataをコンソールに出力

    // 他の処理を行わず、データをログに出力するだけ
  }, [data]);

  return null;
}

SendInviteDxe.propTypes = {
  data: PropTypes.object.isRequired
};
