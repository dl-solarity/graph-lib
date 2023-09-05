import { assert, beforeAll, describe, test } from "matchstick-as";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { NotificationManager, NotificationType } from "../../lib";

describe("push-notification", () => {
  beforeAll(() => {
    NotificationManager.subgraphID = "user1/subgraph40";
  });
  describe("sendPushNotification", () => {
    test("should push 2 notifications", () => {
      const recipient1 = Address.fromString("0x76e98f7d84603AEb97cd1c89A80A9e914f181679");
      const notification1 = NotificationManager.createJSON(
        NotificationType.TARGETED,
        "Title",
        "Body",
        "Subject",
        "Message",
        "img url",
        "secret",
        "url"
      );

      const recipient2 = Address.fromString("0x16e98f7d84603AEb97cd1c89A80A9e914f181679");
      const notification2 = NotificationManager.createJSON(
        NotificationType.BROADCAST,
        "Title2",
        "Body2",
        "Subject2",
        "Message2",
        "img url2",
        "secret2",
        "url2"
      );

      NotificationManager.sendPushNotification(recipient1.toHexString(), notification1);
      NotificationManager.sendPushNotification(recipient2.toHexString(), notification2);

      assert.fieldEquals("EpnsNotificationCounter", NotificationManager.subgraphID, "totalCount", "2");

      assert.fieldEquals(
        "EpnsPushNotification",
        `${NotificationManager.subgraphID}+${BigInt.fromI32(1).toHexString()}`,
        "notificationNumber",
        "1"
      );
      assert.fieldEquals(
        "EpnsPushNotification",
        `${NotificationManager.subgraphID}+${BigInt.fromI32(1).toHexString()}`,
        "recipient",
        recipient1.toHexString()
      );
      assert.fieldEquals(
        "EpnsPushNotification",
        `${NotificationManager.subgraphID}+${BigInt.fromI32(1).toHexString()}`,
        "notification",
        notification1
      );

      assert.fieldEquals(
        "EpnsPushNotification",
        `${NotificationManager.subgraphID}+${BigInt.fromI32(2).toHexString()}`,
        "notificationNumber",
        "2"
      );
      assert.fieldEquals(
        "EpnsPushNotification",
        `${NotificationManager.subgraphID}+${BigInt.fromI32(2).toHexString()}`,
        "recipient",
        recipient2.toHexString()
      );
      assert.fieldEquals(
        "EpnsPushNotification",
        `${NotificationManager.subgraphID}+${BigInt.fromI32(2).toHexString()}`,
        "notification",
        notification2
      );
    });
  });
});
