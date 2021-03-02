CREATE PROCEDURE [dbo].[usp_HoldingSummary]
(
	@period	  int,
	@exchange nvarchar(50)
)
AS
BEGIN
	SET NOCOUNT ON;

	WITH CTE_Data
	AS
		(
			SELECT
				t.symbol,
				t.quantity,
				t.exchange,
				t.trade_type,
				t.price,
				period = (YEAR(t.trade_date) * 100 + MONTH(t.trade_date))
				FROM
					Tradebook t
				WHERE
					t.exchange = @exchange
					AND (YEAR(t.trade_date) * 100 + MONTH(t.trade_date)) <= @period
		),
	CTE_Summary
	AS
		(
			SELECT
				period = @period,
				e.symbol,
				e.name,
				total_sell_qty =
				ISNULL(
				(
					SELECT
						SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period <= @period
							AND t.trade_type = 'sell'
				), 0),
				total_buy_qty =
				ISNULL(
				(
					SELECT
						SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period <= @period
							AND t.trade_type = 'buy'
				), 0),
				total_buy_amt =
				ISNULL(
				(
					SELECT
						SUM(t.quantity * t.price)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period <= @period
							AND t.trade_type = 'buy'
				), 0),
				total_sell_amt =
				ISNULL(
				(
					SELECT
						SUM(t.quantity * t.price)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period <= @period
							AND t.trade_type = 'sell'
				), 0)
				FROM
					Equity e
				WHERE
					EXISTS
					(
						SELECT
							1
							FROM
								Tradebook t
							WHERE
								e.symbol = t.symbol
								AND t.exchange = @exchange
								AND e.exchange = t.exchange
								AND (YEAR(t.trade_date) * 100 + MONTH(t.trade_date)) <= @period
					)
		),
	CTE_Avg
	AS
		(
			SELECT
				[total_sell_qty] = SUM(cs.total_sell_qty),
				[avg_buy] =		   SUM(cs.total_buy_amt) / SUM(cs.total_buy_qty),
				[avg_sell] =	   SUM(cs.total_sell_amt) / SUM(cs.total_sell_qty)
				FROM
					CTE_Summary cs
				GROUP BY
					cs.symbol
				HAVING
					SUM(cs.total_sell_qty) > 0
		),
	CTE_Pnl
	AS
		(
			SELECT
				ROUND(ISNULL(
				(
					SELECT
						SUM((cs.total_sell_qty * cs.avg_sell) - (cs.total_sell_qty * cs.avg_buy))
						FROM
							CTE_Avg cs
				)
				, 0), 2) AS [PnL]
		)
	SELECT
		[ordinal] =	  3,
		[key] =		  'no_of_buy',
		[label] =	  'No of bought',
		[value] =	  
		ROUND(ISNULL(
		(
			SELECT
				COUNT(1)
				FROM
					CTE_Summary cs
				WHERE
					cs.total_buy_qty > 0
		), 0), 2),
		[indicator] = 'p',
		[type] =	  'q'
	UNION
	SELECT
		[ordinal] =	  4,
		[key] =		  'no_of_sold',
		[label] =	  'No of sold',
		[value] =	  
		ROUND(ISNULL(
		(
			SELECT
				COUNT(1)
				FROM
					CTE_Summary cs
				WHERE
					cs.total_sell_qty > 0
		), 0), 2),
		[indicator] = 's',
		[type] =	  'q'
	UNION
	SELECT
		[ordinal] =	  5,
		[key] =		  'total_buy_amt',
		[label] =	  'Total amount bought',
		[value] =	  
		ROUND(ISNULL(
		(
			SELECT
				SUM(cs.total_buy_amt)
				FROM
					CTE_Summary cs
				WHERE
					cs.total_buy_qty > 0
		), 0), 2),
		[indicator] = 'p',
		[type] =	  'c'
	UNION
	SELECT
		[ordinal] =	  6,
		[key] =		  'total_sell_amount',
		[label] =	  'Total amount sold',
		[value] =	  
		ROUND(ISNULL(
		(
			SELECT
				SUM(cs.total_sell_amt)
				FROM
					CTE_Summary cs
				WHERE
					cs.total_sell_qty > 0
		), 0), 2),
		[indicator] = 's',
		[type] =	  'c'
	UNION
	SELECT
		[ordinal] = 7,
		[key] =		'pnl',
		[label] =   'Profit and Loss',
		[value] =   
		p.PnL,
		[indicator] =
			CASE
				WHEN p.PnL > 0 THEN 'p'
				WHEN p.Pnl < 0 THEN 's'
				ELSE 'n'
			END,
		[type] =	'c'
		FROM
			CTE_Pnl p
		ORDER BY
			1;
END
