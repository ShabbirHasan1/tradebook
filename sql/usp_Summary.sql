CREATE PROCEDURE [dbo].[usp_Summary]
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
				avg_buy =
				ISNULL(
				(
					SELECT
						SUM(t.quantity * t.price) / SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period <= @period
							AND t.trade_type = 'buy'

				), 0),
				avg_sell =
				ISNULL(
				(
					SELECT
						SUM(t.quantity * t.price) / SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period <= @period
							AND t.trade_type = 'sell'

				), 0),
				buy_qty =
				ISNULL(
				(
					SELECT
						SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period = @period
							AND t.trade_type = 'buy'
				), 0),
				sell_qty =
				ISNULL(
				(
					SELECT
						SUM(t.quantity)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period = @period
							AND t.trade_type = 'sell'
				), 0),
				buy_amt =
				ISNULL(
				(
					SELECT
						SUM(t.quantity * t.price)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period = @period
							AND t.trade_type = 'buy'
				), 0),
				sell_amt =
				ISNULL(
				(
					SELECT
						SUM(t.quantity * t.price)
						FROM
							CTE_Data t
						WHERE
							t.symbol = e.symbol
							AND t.exchange = e.exchange
							AND t.period = @period
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
		)
	SELECT
		[ordinal] =	  1,
		[key] =		  'nos_bought',
		[label] =	  'No of bought',
		[value] =	  
		ROUND(ISNULL(
		(
			SELECT
				COUNT(cs.buy_qty)
				FROM
					CTE_Summary cs
				WHERE
					cs.buy_qty > 0
		), 0), 2),
		[indicator] = 'p',
		[type] =	  'q'
	UNION
	SELECT
		[ordinal] =	  2,
		[key] =		  'nos_sold',
		[label] =	  'No of sold',
		[value] =	  
		ROUND(ISNULL(
		(
			SELECT
				COUNT(cs.sell_qty)
				FROM
					CTE_Summary cs
				WHERE
					cs.sell_qty > 0
		), 0), 2),
		[indicator] = 's',
		[type] =	  'q'
	UNION
	SELECT
		[ordinal] =	  3,
		[key] =		  'new_entries',
		[label] =	  'New entries',
		[value] =	  
		ROUND(ISNULL(
		(
			SELECT
				COUNT(1)
				FROM
					CTE_Summary cs
				WHERE
					cs.buy_qty = cs.total_buy_qty
		), 0), 2),
		[indicator] = 'p',
		[type] =	  'q'
	UNION
	SELECT
		[ordinal] =	  4,
		[key] =		  'new_exits',
		[label] =	  'New exits',
		[value] =	  
		ROUND(ISNULL(
		(
			SELECT
				COUNT(1)
				FROM
					CTE_Summary cs
				WHERE
					cs.total_sell_qty = cs.total_buy_qty
					AND cs.sell_qty > 0
		), 0), 2),
		[indicator] = 's',
		[type] =	  'q'
	UNION
	SELECT
		[ordinal] =	  5,
		[key] =		  'buy_amt',
		[label] =	  'Total amount bought',
		[value] =	  
		ROUND(ISNULL(
		(
			SELECT
				SUM(cs.buy_amt)
				FROM
					CTE_Summary cs
				WHERE
					cs.buy_qty > 0
		), 0), 2),
		[indicator] = 'p',
		[type] =	  'c'
	UNION
	SELECT
		[ordinal] =	  6,
		[key] =		  'sell_amt',
		[label] =	  'Total amount sold',
		[value] =	  
		ROUND(ISNULL(
		(
			SELECT
				SUM(cs.sell_amt)
				FROM
					CTE_Summary cs
				WHERE
					cs.sell_qty > 0
		), 0), 2),
		[indicator] = 's',
		[type] =	  'c'
	UNION
	SELECT
		[ordinal] = 7,
		[key] =		'pnl',
		[label] =   'Profit and Loss',
		[value] =   
		ROUND(ISNULL(
		(
			SELECT
				SUM((cs.total_sell_qty * cs.avg_sell) - (cs.total_sell_qty * cs.avg_buy))
				FROM
					CTE_Summary cs
		), 0), 2),
		[indicator] =
			CASE
				WHEN ROUND(ISNULL(
					(
						SELECT
							SUM((cs.total_sell_qty * cs.avg_sell) - (cs.total_sell_qty * cs.avg_buy))
							FROM
								CTE_Summary cs
					), 0), 2) > 0 THEN 'p'
				ELSE 's'
			END,
		[type] =	'c'
		ORDER BY
			1;
END
