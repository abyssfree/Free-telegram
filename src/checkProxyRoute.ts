import { Router, type Request, type Response } from 'express';
import { SocksClient, type SocksClientOptions } from 'socks';

/**
 * POST /api/check-proxy
 * Body:
 * {
 *   ip: string,
 *   port: number,
 *   user?: string,
 *   pass?: string
 * }
 */
export const checkProxyRoute = Router();

type CheckProxyBody = {
  ip?: string;
  port?: number | string;
  user?: string;
  pass?: string;
};

checkProxyRoute.post(
  '/api/check-proxy',
  async (req: Request<unknown, unknown, CheckProxyBody>, res: Response) => {
    const { ip, port, user, pass } = req.body ?? {};

    if (!ip || port === undefined || port === null || String(port).trim() === '') {
      return res.status(400).json({ ok: false, error: 'bad_request' });
    }

    const checkedAt = new Date().toISOString();

    const options: SocksClientOptions = {
      command: 'connect',
      proxy: {
        host: ip,
        port: Number(port),
        type: 5,
        ...(user && pass ? { userId: user, password: pass } : {}),
      },
      destination: {
        host: '149.154.167.50',
        port: 443,
      },
      timeout: 5000,
    };

    try {
      const { socket } = await SocksClient.createConnection(options);
      socket.destroy();

      return res.json({ ok: true, checkedAt });
    } catch (err: unknown) {
      console.error('[check-proxy]', ip, port, err);

      const anyErr = err as { code?: unknown; message?: unknown };
      return res.json({
        ok: false,
        checkedAt,
        errorCode: anyErr?.code !== undefined ? String(anyErr.code) : undefined,
        errorMessage:
          anyErr?.message !== undefined ? String(anyErr.message) : String(err),
      });
    }
  }
);
