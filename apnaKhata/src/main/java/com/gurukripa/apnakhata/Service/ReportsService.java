package com.gurukripa.apnakhata.Service;

import com.gurukripa.apnakhata.DTO.*;
import com.gurukripa.apnakhata.Entity.RawMaterial;
import com.gurukripa.apnakhata.Repository.BillLineRepository;
import com.gurukripa.apnakhata.Repository.BillRepository;
import com.gurukripa.apnakhata.Repository.RawMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ReportsService {

    @Autowired
    BillRepository billRepo;

    @Autowired
    BillLineRepository lineRepo;

    @Autowired
    RawMaterialRepository rawMaterialRepo;

    public SalesOverviewDTO getOverview() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime prev = now.minusMonths(1);

        double salesNow  = Optional.ofNullable(billRepo.sumTotalSales(prev, now)).orElse(0.);
        double salesPrev = Optional.ofNullable(billRepo.sumTotalSales(prev.minusMonths(1), prev)).orElse(0.);

        long countNow  = Optional.ofNullable(billRepo.countReleased(prev, now)).orElse(1L);
        long countPrev = Optional.ofNullable(billRepo.countReleased(prev.minusMonths(1), prev)).orElse(1L);

        long itemsNow  = Optional.ofNullable(billRepo.sumItemsSold(prev, now)).orElse(0L);
        long itemsPrev = Optional.ofNullable(billRepo.sumItemsSold(prev.minusMonths(1), prev)).orElse(1L);

        double avgOrder = countNow>0 ? salesNow/countNow : 0.;

        double pctSales = pct(salesNow, salesPrev);
        double pctAOV   = pct(avgOrder, salesPrev/countPrev);
        double pctItems = pct(itemsNow, itemsPrev);

        var tops = lineRepo.findTopSellingItems().stream()
                .limit(8)
                .map(r -> new SalesOverviewDTO.TopItem(
                        null,
                        (String)r[0],
                        ((Number)r[1]).longValue()))
                .toList();

        return new SalesOverviewDTO(
                salesNow, avgOrder, itemsNow,
                pctSales, pctAOV, pctItems,
                tops
        );
    }

    public ItemTrendDTO getTopItemTrends(String period) {
        LocalDate today = LocalDate.now();
        int days = switch (period.toLowerCase()) {
            case "day" -> 3;
            case "week" -> 7;
            default -> 30;
        };

        List<LocalDate> dateRange = IntStream.range(0, days)
                .mapToObj(today::minusDays)
                .sorted()
                .toList();

        List<Object[]> raw = lineRepo.aggregateTopItemSales(
                today.minusDays(days - 1).atStartOfDay(),
                today.plusDays(1).atStartOfDay()
        );

        Map<LocalDate, Map<String, Long>> dailyItemSales = new HashMap<>();
        for (Object[] row : raw) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();  // date from SQL
            String itemName = (String) row[1];
            Long quantity = ((Number) row[2]).longValue();

            dailyItemSales
                    .computeIfAbsent(date, d -> new HashMap<>())
                    .put(itemName, quantity);
        }


        // Get top N item names
        List<String> topItemNames = lineRepo.findTopSellingItems().stream()
                .limit(5)
                .map(r -> (String) r[0])
                .toList();

        List<ItemTrendDTO.ItemSeries> itemSeries = new ArrayList<>();

        for (String name : topItemNames) {
            List<Long> values = new ArrayList<>();
            for (LocalDate date : dateRange) {
                long value = Optional.ofNullable(dailyItemSales.getOrDefault(date, Map.of()).get(name)).orElse(0L);
                values.add(value);
            }
            itemSeries.add(new ItemTrendDTO.ItemSeries(name, values));
        }

        List<String> labels = dateRange.stream()
                .map(LocalDate::toString)
                .toList();

        return new ItemTrendDTO(labels, itemSeries);
    }


    public SalesTrendDTO getTrend(String period) {
        LocalDate today = LocalDate.now(); // only date needed, no time
        int days;

        switch (period.toLowerCase()) {
            case "day":
                days = 3;
                break;
            case "week":
                days = 7;
                break;
            default:
                days = 30;
                break;
        }

        // Prepare list of dates: today minus N days
        List<LocalDate> dateRange = IntStream.range(0, days)
                .mapToObj(today::minusDays)
                .sorted()
                .collect(Collectors.toList());

        // Initialize date -> value map
        Map<String, Double> dailyTotals = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;

        for (LocalDate date : dateRange) {
            dailyTotals.put(date.format(formatter), 0.0);
        }

        // Query DB once for full range
        LocalDate startDate = today.minusDays(days - 1);
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay(); // exclusive upper bound

        List<Object[]> raw = billRepo.aggregateSalesByDate(start, end);
        // Expects Object[] = { LocalDate, total }

        for (Object[] row : raw) {
            LocalDate date = ((java.sql.Date) row[0]).toLocalDate();
            Double total = ((Number) row[1]).doubleValue();
            String key = date.format(formatter);
            if (dailyTotals.containsKey(key)) {
                dailyTotals.put(key, total);
            }
        }

        // Past period comparison
        LocalDateTime prevStart = start.minusDays(days);
        LocalDateTime prevEnd = start;

        Double prevSum = Optional.ofNullable(
                billRepo.sumTotalSales(prevStart, prevEnd)
        ).orElse(0.0);

        List<String> labels = new ArrayList<>(dailyTotals.keySet());
        List<Double> values = new ArrayList<>(dailyTotals.values());
        double curSum = values.stream().mapToDouble(Double::doubleValue).sum();
        double pct = pct(curSum, prevSum);

        return new SalesTrendDTO(period, labels, values, pct);
    }

    /**
     * How many items were sold over the same windows.
     */
    public ConsumptionDTO getConsumption(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start;
        String pattern;

        switch (period.toLowerCase()) {
            case "day":
                start   = now.minusDays(1);
                pattern = "HH':00'";      // hour buckets
                break;
            case "week":
                start   = now.minusWeeks(1);
                pattern = "YYYY-ww";      // ISO week-of-year
                break;
            default:
                start   = now.minusMonths(1);
                pattern = "yyyy-MM";      // year-month
        }

        List<Object[]> raw = lineRepo.aggregateQuantity(start, now, pattern);

        List<String> labels = raw.stream()
                .map(r -> (String) r[0])
                .collect(Collectors.toList());

        List<Long> values = raw.stream()
                .map(r -> Optional.ofNullable((Number) r[1]).map(Number::longValue).orElse(0L))
                .collect(Collectors.toList());

        long curSum  = values.stream().mapToLong(Long::longValue).sum();
        Duration window = Duration.between(start, now);
        LocalDateTime prevStart = start.minus(window);
        LocalDateTime prevEnd   = start;

        // now call your sumItemsSold with both from & to
        Long prevSumRaw = billRepo.sumItemsSold(prevStart, prevEnd);
        long prevSum    = Optional.ofNullable(prevSumRaw).orElse(0L);

        double pct = prevSum == 0
                ? (curSum == 0 ? 0 : 100)
                : (double)(curSum - prevSum) / prevSum * 100;

        return new ConsumptionDTO(period, labels, values, pct);
    }


    public InventoryStatusDTO getInventoryStatus() {
        // 1️⃣ Count of raw materials in stock and above threshold
        List<RawMaterial> allMaterials = rawMaterialRepo.findAll();
        long inStockAboveThreshold = allMaterials.stream()
                .filter(material -> {
                    Integer quantity = material.getQuantityOnHand();
                    Integer minThreshold = material.getMinThreshold();
                    if (quantity == null) quantity = 0;
                    if (minThreshold == null) minThreshold = 0;
                    return quantity > minThreshold;
                })
                .count();

        // 2️⃣ Low-stock: those below their own minThreshold
        List<String> lowNames = new ArrayList<>();
        List<String> outNames = new ArrayList<>();

        for (RawMaterial material : allMaterials) {
            Integer quantity = material.getQuantityOnHand();
            Integer minThreshold = material.getMinThreshold();
            if (quantity == null) quantity = 0;
            if (minThreshold == null) minThreshold = 0;

            if (quantity < minThreshold) {
                lowNames.add(material.getName());
            }
            if (quantity <= 0) {
                outNames.add(material.getName());
            }
        }

        return InventoryStatusDTO.builder()
                .totalItemsSold(inStockAboveThreshold)
                .lowStockItems(lowNames.size())
                .outOfStockItems(outNames.size())
                .lowStockNames(lowNames)
                .outOfStockNames(outNames)
                .build();
    }

    /** Helper for percentage change */
    private double pct(double cur, double prev) {
        if (prev == 0) return cur == 0 ? 0 : 100;
        return (cur - prev) / prev * 100;
    }
}

