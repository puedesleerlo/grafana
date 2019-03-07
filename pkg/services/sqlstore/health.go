package sqlstore

import (
	"github.com/puedesleerlo/grafana/pkg/bus"
	m "github.com/puedesleerlo/grafana/pkg/models"
)

func init() {
	bus.AddHandler("sql", GetDBHealthQuery)
}

func GetDBHealthQuery(query *m.GetDBHealthQuery) error {
	return x.Ping()
}
