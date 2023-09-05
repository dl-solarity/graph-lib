import { BigInt, log } from "@graphprotocol/graph-ts";
import { EpnsNotificationCounter, EpnsPushNotification } from "../../tests/mocks/MockNotificationsEntities"; // comment this later
// import { EpnsNotificationCounter, EpnsPushNotification } from "../../../generated/schema";

export class NotificationManager {
  public static subgraphID: string = "<GITHUB_USERNAME>/<SUBGRAPH_NAME>";

  public static sendPushNotification(recipient: string, notification: string): void {
    let id1 = this.subgraphID;
    log.info("New id of EpnsNotificationCounter is: {}", [id1]);
    let epnsNotificationCounter = EpnsNotificationCounter.load(id1);
    if (epnsNotificationCounter == null) {
      epnsNotificationCounter = new EpnsNotificationCounter(id1);
      epnsNotificationCounter.totalCount = BigInt.fromI32(0);
    }
    epnsNotificationCounter.totalCount = epnsNotificationCounter.totalCount.plus(BigInt.fromI32(1));

    let count = epnsNotificationCounter.totalCount.toHexString();
    let id2 = `${this.subgraphID}+${count}`;
    log.info("New id of EpnsPushNotification is: {}", [id2]);
    let epnsPushNotification = EpnsPushNotification.load(id2);
    if (epnsPushNotification == null) {
      epnsPushNotification = new EpnsPushNotification(id2);
    }
    epnsPushNotification.recipient = recipient;
    epnsPushNotification.notification = notification;
    epnsPushNotification.notificationNumber = epnsNotificationCounter.totalCount;
    epnsPushNotification.save();
    epnsNotificationCounter.save();
  }

  public static createJSON(
    type: NotificationType,
    title: string,
    body: string,
    subject: string,
    message: string,
    image: string,
    secret: string,
    cta: string
  ): string {
    return `{\"type\": \"${type}\", \"title\": \"${title}\", \"body\": \"${body}\", \"subject\": \"${subject}\", \"message\": \"${message}\", \"image\": \"${image}\", \"secret\": \"${secret}\", \"cta\": \"${cta}\"}`;
  }
}

export enum NotificationType {
  BROADCAST = 1,
  TARGETED = 3,
  SUBSET = 4,
}
