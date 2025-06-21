package com.gurukripa.apnakhata.Service;

import com.gurukripa.apnakhata.Entity.Bill;
import com.gurukripa.apnakhata.Entity.BillLine;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
import java.util.stream.IntStream;

// Email
@Service
public class AlertEmailService {
    @Autowired
    JavaMailSender mail;

    public void sendBillReleased(String to, Bill bill) throws MessagingException {
        MimeMessage msg = mail.createMimeMessage();
        MimeMessageHelper h = new MimeMessageHelper(msg, false, "UTF-8");
        h.setTo(to);
        h.setSubject("🧾 Bill #" + bill.getId() + " Released");
        h.setText(
                "Your bill was released at " + bill.getReleasedAt() +
                        "\nTotal: ₹" + bill.getLines().stream().map(BillLine::getLineTotal).toList()
        );
        mail.send(msg);
    }

    public void sendLowStock(String to, String item, int qty,int threshold) throws MessagingException {
        String[] mailList = {"sachdevalove2@gmail.com","sun.sons.sachdeva@gmail.com","sachdevayash007@gmail.com"};
        MimeMessage msg = mail.createMimeMessage();
        MimeMessageHelper h = new MimeMessageHelper(msg, false, "UTF-8");
        h.setTo(mailList);
        h.setSubject("Low Stock: " + item + " Please take action immediately !!");
        h.setText(item + " is down to only " + qty + " units! The item is already below threshold of "+threshold+" Please re-order immediately");
        mail.send(msg);
    }
}

