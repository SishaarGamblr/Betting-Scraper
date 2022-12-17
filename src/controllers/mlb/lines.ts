import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import moment from "moment";
import prisma from "../../lib/prisma";

function isISODate(date: string) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!date.match(regEx)) return false; // Invalid format
  const d = new Date(date);
  var dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return true;
}

export default async function linesController(fastify: FastifyInstance) {
  fastify.get(
    "/lines",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["date"],
          properties: {
            date: {
              type: "string",
            },
          },
        },
      },
    },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const payload = request.query as Record<string, string>;

      let date;
      if (isISODate(payload.date)) {
        date = moment(payload.date);
      } else {
        reply.send(new Error("Invalid date provided, must be YYYY-MM-DD"));
      }

      const lines = await prisma.line_MLB.findMany({
        where: {
          date: {
            gte: date?.startOf("day").toISOString(),
          },
        },
      });

      reply.send(lines);
    }
  );
}
